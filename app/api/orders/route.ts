import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { OrderStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: (session.user as any).id },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { productId, variantId, quantity = 1, paymentMethod, amount, metadata } = body;

    if (!productId || !paymentMethod || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      );
    }

    const order = await prisma.order.create({
      data: {
        userId: (session.user as any).id,
        status: paymentMethod === 'MANUAL' ? OrderStatus.PENDING_VERIFICATION : OrderStatus.PENDING_PAYMENT,
        totalAmount: amount,
        paymentMethod,
        metadata: metadata || {},
        items: {
          create: {
            productId,
            variantId,
            quantity,
            unitPrice: amount / quantity,
            totalPrice: amount,
          },
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
