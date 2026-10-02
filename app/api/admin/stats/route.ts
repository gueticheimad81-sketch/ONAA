import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { OrderStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalRevenue, pendingOrders, completedOrders, totalUsers, topProduct] = await Promise.all([
      prisma.order.aggregate({
        where: { status: OrderStatus.DELIVERED },
        _sum: { totalAmount: true },
      }),
      prisma.order.count({
        where: {
          status: {
            in: [OrderStatus.PENDING_VERIFICATION, OrderStatus.PENDING_PAYMENT],
          },
        },
      }),
      prisma.order.count({
        where: { status: OrderStatus.DELIVERED },
      }),
      prisma.user.count(),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _count: true,
        orderBy: {
          _count: 'desc',
        },
        take: 1,
      }),
    ]);

    let topProductName = 'N/A';
    if (topProduct.length > 0) {
      const product = await prisma.product.findUnique({
        where: { id: topProduct[0].productId },
      });
      topProductName = product?.name || 'Unknown';
    }

    return NextResponse.json({
      stats: {
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        pendingOrders,
        completedOrders,
        totalUsers,
        topProduct: topProductName,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
