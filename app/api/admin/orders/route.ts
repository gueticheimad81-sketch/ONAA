import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const status = req.nextUrl.searchParams.get('status');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50', 10);

    const where = status ? { status } : {};

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: true,
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const total = await prisma.order.count({ where });

    return NextResponse.json({ orders, total });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
