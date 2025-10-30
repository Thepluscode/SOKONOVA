import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

// helper: get ISO timestamp for now minus N days
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

@Injectable()
export class AnalyticsSellerService {
  constructor(private prisma: PrismaService) {}

  // The main entry: returns all metrics for seller dashboard
  async getSellerSummary(sellerId: string) {
    // time window for "last 7 days"
    const since7 = daysAgo(7);

    // 1. Revenue last 7 days (sum of netAmount on PAID orders)
    // we'll only count items whose parent order is PAID
    const recentItems = await this.prisma.orderItem.findMany({
      where: {
        sellerId,
        createdAt: { gte: since7 },
        order: { status: 'PAID' },
      },
      select: {
        netAmount: true,
        currency: true,
        productId: true,
        qty: true,
        product: {
          select: { title: true },
        },
      },
    });

    const revenueCurrency = recentItems[0]?.currency || 'USD';
    const revenue7d = recentItems.reduce(
      (acc, it) => acc + Number(it.netAmount),
      0,
    );

    // 2. Top-selling SKUs (by quantity sold, last 7 days)
    const skuMap: Record<
      string,
      { productId: string; title: string; qty: number }
    > = {};
    for (const it of recentItems) {
      const pid = it.productId;
      if (!skuMap[pid]) {
        skuMap[pid] = {
          productId: pid,
          title: it.product?.title || 'Untitled',
          qty: 0,
        };
      }
      skuMap[pid].qty += it.qty;
    }
    const topSkus = Object.values(skuMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // 3. Dispute rate (last 30 days)
    // disputeRate = open/active disputes divided by total items sold
    const since30 = daysAgo(30);

    const sold30 = await this.prisma.orderItem.count({
      where: {
        sellerId,
        createdAt: { gte: since30 },
        order: { status: 'PAID' },
      },
    });

    // disputes that are NOT fully rejected
    const disputes30 = await this.prisma.dispute.count({
      where: {
        orderItem: {
          sellerId,
          createdAt: { gte: since30 },
        },
        status: {
          not: 'REJECTED',
        },
      },
    });

    const disputeRate = sold30 === 0 ? 0 : (disputes30 / sold30) * 100; // percentage

    // 4. Rating trend
    // We'll fetch last ~10 reviews, sorted oldest→newest to draw a sparkline in UI.
    const lastReviews = await this.prisma.review.findMany({
      where: {
        sellerId,
        isVisible: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        rating: true,
        createdAt: true,
      },
    });

    // reverse so earliest first for graphs
    const trendPoints = [...lastReviews]
      .reverse()
      .map((r) => ({
        rating: r.rating,
        ts: r.createdAt,
      }));

    // compute current rating summary (already stored on seller)
    const seller = await this.prisma.user.findUnique({
      where: { id: sellerId },
      select: {
        ratingAvg: true,
        ratingCount: true,
        shopName: true,
        sellerHandle: true,
      },
    });

    return {
      sellerMeta: {
        shopName: seller?.shopName || null,
        sellerHandle: seller?.sellerHandle || null,
      },
      revenue7d: {
        amount: revenue7d,
        currency: revenueCurrency,
      },
      topSkus,
      dispute: {
        disputeRatePct: disputeRate,
        soldWindow: sold30,
        disputesWindow: disputes30,
      },
      rating: {
        avg: seller?.ratingAvg || 0,
        count: seller?.ratingCount || 0,
        trend: trendPoints, // [{rating:4, ts:"2025-10-29T12:00Z"}, ...]
      },
    };
  }
}
