import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminControlTowerService {
  constructor(private prisma: PrismaService) {}

  async getSystemHealth(adminId: string) {
    // Verify admin access
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: 'ADMIN' },
    });
    
    if (!admin) {
      throw new Error('Unauthorized access');
    }
    
    // Get system metrics
    const userCount = await this.prisma.user.count();
    const productCount = await this.prisma.product.count();
    const orderCount = await this.prisma.order.count();
    const sellerCount = await this.prisma.user.count({
      where: { role: 'SELLER' },
    });
    
    // Get recent orders count (last 24 hours)
    const recentOrdersCount = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });
    
    // Get pending seller applications
    const pendingApplications = await this.prisma.sellerApplication.count({
      where: { status: 'PENDING' },
    });
    
    // Get open disputes
    const openDisputes = await this.prisma.dispute.count({
      where: { status: 'OPEN' },
    });
    
    // Calculate growth metrics
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const usersYesterday = await this.prisma.user.count({
      where: {
        createdAt: {
          lt: yesterday,
        },
      },
    });
    
    const userGrowth = userCount - usersYesterday;
    
    return {
      userCount,
      productCount,
      orderCount,
      sellerCount,
      recentOrdersCount,
      pendingApplications,
      openDisputes,
      userGrowth,
      healthStatus: this.calculateHealthStatus(userCount, productCount, orderCount, openDisputes),
    };
  }

  async getPlatformMetrics(adminId: string) {
    // Verify admin access
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: 'ADMIN' },
    });
    
    if (!admin) {
      throw new Error('Unauthorized access');
    }
    
    // Get revenue metrics
    const totalRevenue = await this.prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'SUCCEEDED',
      },
    });
    
    // Get order fulfillment stats
    const fulfillmentStats = await this.prisma.orderItem.groupBy({
      by: ['fulfillmentStatus'],
      _count: true,
    });
    
    // Get payment success rate
    const paymentStats = await this.prisma.payment.groupBy({
      by: ['status'],
      _count: true,
    });
    
    // Get seller performance
    const topSellers = await this.prisma.user.findMany({
      where: { role: 'SELLER' },
      select: {
        id: true,
        shopName: true,
        ratingAvg: true,
        ratingCount: true,
        products: {
          select: {
            _count: true,
          },
        },
      },
      take: 10,
      orderBy: { ratingAvg: 'desc' },
    });
    
    // Get category distribution
    const categoryDistribution = await this.prisma.product.groupBy({
      by: ['category'],
      _count: true,
    });
    
    return {
      totalRevenue: totalRevenue._sum.amount || 0,
      fulfillmentStats,
      paymentStats,
      topSellers,
      categoryDistribution,
    };
  }

  async getRecentActivities(adminId: string) {
    // Verify admin access
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: 'ADMIN' },
    });
    
    if (!admin) {
      throw new Error('Unauthorized access');
    }
    
    // Get recent orders
    const recentOrders = await this.prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        items: {
          select: {
            product: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });
    
    // Get recent user signups
    const recentUsers = await this.prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    
    // Get recent product listings
    const recentProducts = await this.prisma.product.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        seller: {
          select: {
            shopName: true,
          },
        },
      },
    });
    
    return {
      recentOrders,
      recentUsers,
      recentProducts,
    };
  }

  async getSystemAlerts(adminId: string) {
    // Verify admin access
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: 'ADMIN' },
    });
    
    if (!admin) {
      throw new Error('Unauthorized access');
    }
    
    // Get recent counterfeit reports
    const recentReports = await this.prisma.counterfeitReport.findMany({
      take: 5,
      where: { status: 'PENDING_REVIEW' },
      include: {
        reporter: {
          select: {
            name: true,
          },
        },
        product: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // Get sellers with compliance issues
    const complianceIssues = await this.prisma.kYCDocument.findMany({
      take: 5,
      where: { status: 'REJECTED' },
      include: {
        seller: {
          select: {
            shopName: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
    
    // Get pending seller applications
    const pendingApplications = await this.prisma.sellerApplication.findMany({
      take: 5,
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            country: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // Get open disputes
    const openDisputes = await this.prisma.dispute.findMany({
      take: 5,
      where: { status: 'OPEN' },
      include: {
        buyer: {
          select: {
            name: true,
          },
        },
        orderItem: {
          include: {
            product: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return {
      recentReports,
      complianceIssues,
      pendingApplications,
      openDisputes,
    };
  }

  async getUserInsights(adminId: string) {
    // Verify admin access
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: 'ADMIN' },
    });
    
    if (!admin) {
      throw new Error('Unauthorized access');
    }
    
    // Get user demographics
    const userByCountry = await this.prisma.user.groupBy({
      by: ['country'],
      _count: true,
      orderBy: {
        _count: {
          country: 'desc',
        },
      },
    });
    
    // Get user role distribution
    const userByRole = await this.prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });
    
    // Get user activity (last login)
    const activeUsers = await this.prisma.user.count({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    });
    
    // Get user retention (users with at least one order)
    const usersWithOrders = await this.prisma.user.count({
      where: {
        orders: {
          some: {},
        },
      },
    });
    
    return {
      userByCountry,
      userByRole,
      activeUsers,
      usersWithOrders,
      totalUsers: await this.prisma.user.count(),
    };
  }

  private calculateHealthStatus(
    userCount: number,
    productCount: number,
    orderCount: number,
    openDisputes: number
  ): string {
    // Simple health calculation based on key metrics
    if (openDisputes > 10) {
      return 'CRITICAL';
    } else if (openDisputes > 5) {
      return 'WARNING';
    } else if (userCount > 100 && productCount > 500 && orderCount > 100) {
      return 'HEALTHY';
    } else {
      return 'STABLE';
    }
  }
}