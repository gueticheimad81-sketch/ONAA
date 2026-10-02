import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    orders: [
      { id: 'ord_123', status: 'pending_verification', total: 49.99, customer: 'jane@example.com' },
      { id: 'ord_124', status: 'delivered', total: 24.99, customer: 'john@example.com' },
    ],
  });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  return NextResponse.json({ success: true, order: body });
}
