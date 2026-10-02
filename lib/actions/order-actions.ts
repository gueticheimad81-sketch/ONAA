"use server";

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { orderSchema, paymentProofSchema } from '@/lib/validators';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import fs from 'fs';
import path from 'path';

export async function createOrder(formData: FormData, userId: string) {
  try {
    const payload = {
      productId: formData.get('productId') as string,
      customerName: formData.get('customerName') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || undefined,
      paymentMethod: formData.get('paymentMethod') as PaymentMethod,
      amount: Number(formData.get('amount') || 0),
      metadata: {
        variant: formData.get('variant') || '',
        variantId: formData.get('variantId') || '',
        input: formData.get('input') || '',
      },
    };

    const parsed = orderSchema.safeParse(payload);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || 'Invalid order data',
      };
    }

    const product = await prisma.product.findUnique({
      where: { id: parsed.data.productId },
    });

    if (!product || !product.isActive) {
      return { success: false, error: 'Product not found or inactive' };
    }

    const order = await prisma.order.create({
      data: {
        userId,
        status: parsed.data.paymentMethod === 'MANUAL' ? OrderStatus.PENDING_VERIFICATION : OrderStatus.PENDING_PAYMENT,
        totalAmount: parsed.data.amount,
        paymentMethod: parsed.data.paymentMethod,
        metadata: parsed.data.metadata,
        items: {
          create: {
            productId: parsed.data.productId,
            quantity: 1,
            unitPrice: parsed.data.amount,
            totalPrice: parsed.data.amount,
          },
        },
      },
      include: { items: true },
    });

    revalidatePath('/dashboard');
    return { success: true, order };
  } catch (error) {
    console.error('Order creation error:', error);
    return { success: false, error: 'Failed to create order' };
  }
}

export async function submitPaymentProof(formData: FormData, orderId: string, userId: string) {
  try {
    const file = formData.get('proof') as File | null;
    const notes = formData.get('notes') as string;

    if (!file) {
      return { success: false, error: 'Proof file is required' };
    }

    const uploadDir = process.env.UPLOAD_DIR || './public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `proof-${orderId}-${timestamp}-${file.name.replace(/[^a-z0-9.-]/gi, '_')}`;
    const filepath = path.join(uploadDir, filename);
    const relativePath = `/uploads/${filename}`;

    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== userId) {
      fs.unlinkSync(filepath);
      return { success: false, error: 'Order not found or unauthorized' };
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentReceiptUrl: relativePath,
        status: OrderStatus.PENDING_VERIFICATION,
        metadata: {
          ...(order.metadata as any),
          proofNotes: notes,
          proofSubmittedAt: new Date().toISOString(),
        },
      },
    });

    revalidatePath(`/dashboard/order/${orderId}`);
    revalidatePath('/admin/orders');
    return { success: true, order: updated };
  } catch (error) {
    console.error('Payment proof upload error:', error);
    return { success: false, error: 'Failed to upload proof' };
  }
}

export async function approveOrderPayment(orderId: string, licenseCode?: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.DELIVERED,
        metadata: {
          ...(order.metadata as any),
          approvedAt: new Date().toISOString(),
          licenseCode,
        },
      },
    });

    revalidatePath('/admin/orders');
    revalidatePath(`/dashboard/order/${orderId}`);
    return { success: true, order: updated };
  } catch (error) {
    console.error('Order approval error:', error);
    return { success: false, error: 'Failed to approve order' };
  }
}

export async function rejectOrderPayment(orderId: string, reason: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.REJECTED,
        metadata: {
          ...(order.metadata as any),
          rejectionReason: reason,
          rejectedAt: new Date().toISOString(),
        },
      },
    });

    revalidatePath('/admin/orders');
    revalidatePath(`/dashboard/order/${orderId}`);
    return { success: true, order: updated };
  } catch (error) {
    console.error('Order rejection error:', error);
    return { success: false, error: 'Failed to reject order' };
  }
}

export async function getOrdersForUser(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, orders };
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return { success: false, error: 'Failed to fetch orders', orders: [] };
  }
}

export async function getPendingOrders() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: [OrderStatus.PENDING_VERIFICATION, OrderStatus.PENDING_PAYMENT],
        },
      },
      include: {
        user: true,
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });
    return { success: true, orders };
  } catch (error) {
    console.error('Failed to fetch pending orders:', error);
    return { success: false, error: 'Failed to fetch orders', orders: [] };
  }
}
