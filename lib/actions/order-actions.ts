"use server";

import { revalidatePath } from 'next/cache';
import { orderSchema } from '@/lib/validators';

export async function createOrder(formData: FormData) {
  const payload = {
    productId: formData.get('productId'),
    customerName: formData.get('customerName'),
    email: formData.get('email'),
    phone: formData.get('phone') ?? undefined,
    paymentMethod: formData.get('paymentMethod'),
    amount: Number(formData.get('amount') ?? 0),
    metadata: {
      variant: formData.get('variant') ?? '',
      delivery: formData.get('delivery') ?? 'instant',
    },
  };

  const parsed = orderSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid order payload' };
  }

  const order = {
    id: crypto.randomUUID(),
    ...parsed.data,
    status: 'pending_verification',
    createdAt: new Date().toISOString(),
  };

  revalidatePath('/dashboard');
  return { success: true, order };
}

export async function submitPaymentProof(formData: FormData) {
  const payload = {
    orderId: formData.get('orderId'),
    proofUrl: formData.get('proofUrl'),
    notes: formData.get('notes') ?? '',
  };

  const parsed = (await import('@/lib/validators')).paymentProofSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Proof invalid' };
  }

  revalidatePath('/admin');
  return { success: true, message: 'Payment proof submitted for review.' };
}

export async function approveOrderAction(orderId: string) {
  revalidatePath('/admin');
  return { success: true, orderId, status: 'approved' };
}
