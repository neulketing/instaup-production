import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardMetrics = async () => {
  const totalUsers = await prisma.user.count();
  const totalOrders = await prisma.order.count();
  const totalRevenueData = await prisma.order.aggregate({
    _sum: {
      charge: true,
    },
    where: {
      status: OrderStatus.COMPLETED,
    },
  });

  const totalRevenue = totalRevenueData._sum.charge ?? 0;

  const totalServices = await prisma.service.count();

  const pendingOrders = await prisma.order.count({
    where: {
      status: OrderStatus.PENDING,
    }
  });

  const processingOrders = await prisma.order.count({
    where: {
      status: OrderStatus.PROCESSING,
    }
  });

  return {
    totalUsers,
    totalOrders,
    totalRevenue,
    totalServices,
    pendingOrders,
    processingOrders,
  };
};
