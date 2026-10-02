import { NextResponse } from 'next/server';
import { z } from 'zod';

const OrderInput = z.object({
  productId: z.string().min(1),
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  paymentMethod: z.enum(['manual', 'stripe', 'crypto']),
  amount: z.number().positive(),
  metadata: z.record(z.any()).default({}),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = OrderInput.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.issues }, { status: 400 });
    }

    const order = {
      id: crypto.randomUUID(),
      ...parsed.data,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
