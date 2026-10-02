import { z } from 'zod';

export const orderSchema = z.object({
  productId: z.string().min(1),
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  paymentMethod: z.enum(['manual', 'stripe', 'crypto']),
  amount: z.number().positive(),
  metadata: z.record(z.any()).default({}),
});

export const paymentProofSchema = z.object({
  orderId: z.string().min(1),
  proofUrl: z.string().url(),
  notes: z.string().max(500).optional(),
});
