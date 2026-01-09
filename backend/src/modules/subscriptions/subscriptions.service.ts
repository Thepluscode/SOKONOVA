import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getSubscriptionPlans() {
    const plans = await this.prisma.subscriptionPlan.findMany({
      where: { active: true },
      orderBy: { price: 'asc' },
    });
    
    return plans;
  }

  async createSubscription(data: {
    userId: string;
    planId: string;
    paymentMethod: string;
  }) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: data.planId },
    });
    
    if (!plan) {
      throw new Error('Plan not found');
    }
    
    // Check if user already has an active subscription
    const existingSubscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId: data.userId,
        status: 'ACTIVE' as SubscriptionStatus,
      },
    });
    
    if (existingSubscription) {
      throw new Error('User already has an active subscription');
    }
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 1);
    
    const subscription = await this.prisma.userSubscription.create({
      data: {
        userId: data.userId,
        planId: data.planId,
        planPrice: plan.price,
        status: 'ACTIVE' as SubscriptionStatus,
        startDate,
        endDate,
        autoRenew: true,
        paymentMethod: data.paymentMethod,
      },
    });
    
    return subscription;
  }

  async getMySubscription(userId: string) {
    const subscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE' as SubscriptionStatus,
      },
      include: {
        plan: true,
      },
    });
    
    return subscription;
  }

  async cancelSubscription(id: string, userId: string) {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { id },
    });
    
    if (!subscription || subscription.userId !== userId) {
      throw new Error('Subscription not found or unauthorized');
    }
    
    const updatedSubscription = await this.prisma.userSubscription.update({
      where: { id },
      data: {
        status: 'CANCELLED' as SubscriptionStatus,
        cancelledAt: new Date(),
        autoRenew: false,
      },
    });
    
    return updatedSubscription;
  }

  async getAllSubscriptions(adminId: string) {
    // In a real implementation, we would verify admin permissions
    const subscriptions = await this.prisma.userSubscription.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return subscriptions;
  }

  async getSubscriptionStats(adminId: string) {
    // In a real implementation, we would verify admin permissions
    const totalSubscriptions = await this.prisma.userSubscription.count();
    const activeSubscriptions = await this.prisma.userSubscription.count({
      where: { status: 'ACTIVE' as SubscriptionStatus },
    });
    
    const subscriptionsByPlan = await this.prisma.subscriptionPlan.findMany({
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' as SubscriptionStatus },
        },
      },
    });
    
    const planStats = subscriptionsByPlan.map(plan => ({
      planId: plan.id,
      planName: plan.name,
      activeSubscriptions: plan.subscriptions.length,
    }));
    
    const totalRevenue = await this.prisma.userSubscription.aggregate({
      _sum: {
        planPrice: true,
      },
      where: {
        status: 'ACTIVE' as SubscriptionStatus,
      },
    });
    
    return {
      totalSubscriptions,
      activeSubscriptions,
      planStats,
      totalRevenue: totalRevenue._sum.planPrice || 0,
    };
  }
}