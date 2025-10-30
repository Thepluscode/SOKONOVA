import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

@Injectable()
export class AnalyticsRollupService {
  constructor(private prisma: PrismaService) {}

  async getOpsSummary(adminId: string) {
    // auth: must be ADMIN
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });
    if (!admin || admin.role !== 'ADMIN') {
      throw new ForbiddenException('Not authorized');
    }

    // define time windows
    const since7 = daysAgo(7);
    const since30 = daysAgo(30);

    // ---------------------------
    // 1. GMV by city (last 7 days)
    //
    // GMV = grossAmount sum of paid order items.
    // We'll attribute GMV to seller.city (so "GMV Lagos", "GMV Nairobi", etc.)
    // ---------------------------
    const items7d = await this.prisma.orderItem.findMany({
      where: {
        createdAt: { gte: since7 },
        order: { status: 'PAID' },
      },
      select: {
        grossAmount: true,
        currency: true,
        sellerId: true,
      },
    });

    // Fetch unique seller IDs and get their city/country info
    const sellerIds = [...new Set(items7d.map(it => it.sellerId))];
    const sellers = await this.prisma.user.findMany({
      where: { id: { in: sellerIds } },
      select: { id: true, city: true, country: true },
    });
    const sellerMap = new Map(sellers.map(s => [s.id, s]));

    type CityAgg = Record<
      string,
      { cityLabel: string; gmv: number; currency: string }
    >;
    const gmvByCity: CityAgg = {};

    for (const it of items7d) {
      const seller = sellerMap.get(it.sellerId);
      const cityKey = (seller?.city || seller?.country || 'Unknown').toLowerCase();
      if (!gmvByCity[cityKey]) {
        gmvByCity[cityKey] = {
          cityLabel: seller?.city
            ? `${seller.city}${seller.country ? ', ' + seller.country : ''}`
            : seller?.country || 'Unknown',
          gmv: 0,
          currency: it.currency || 'USD',
        };
      }
      gmvByCity[cityKey].gmv += Number(it.grossAmount);
    }

    // sort city GMV descending
    const gmvByCityArr = Object.values(gmvByCity).sort(
      (a, b) => b.gmv - a.gmv
    );

    // ---------------------------
    // 2. Top categories (last 7 days)
    //
    // We'll rank categories by total grossAmount.
    // ---------------------------
    const itemsWithCat = await this.prisma.orderItem.findMany({
      where: {
        createdAt: { gte: since7 },
        order: { status: 'PAID' },
      },
      include: {
        product: {
          select: {
            category: true,
          },
        },
      },
    });

    const catAgg: Record<string, { category: string; gmv: number }> = {};
    for (const it of itemsWithCat) {
      const cat = it.product?.category || 'other';
      if (!catAgg[cat]) {
        catAgg[cat] = { category: cat, gmv: 0 };
      }
      catAgg[cat].gmv += Number(it.grossAmount);
    }
    const topCategories = Object.values(catAgg)
      .sort((a, b) => b.gmv - a.gmv)
      .slice(0, 5);

    // ---------------------------
    // 3. Sellers by revenue (last 7 days)
    //
    // Use seller netAmount (their take-home) to show who is doing volume.
    // This is what investors call "top sellers / power sellers".
    // ---------------------------
    const sellerRevMap: Record<
      string,
      {
        sellerId: string;
        shopName: string | null;
        handle: string | null;
        city: string | null;
        country: string | null;
        netRevenue7d: number;
        ratingAvg: number;
        ratingCount: number;
      }
    > = {};

    const sellerRevRows = await this.prisma.orderItem.findMany({
      where: {
        createdAt: { gte: since7 },
        order: { status: 'PAID' },
      },
      select: {
        sellerId: true,
        netAmount: true,
      },
    });

    // Get unique seller IDs and fetch their info
    const revenueSellerIds = [...new Set(sellerRevRows.map(r => r.sellerId))];
    const revenueSellers = await this.prisma.user.findMany({
      where: { id: { in: revenueSellerIds } },
      select: {
        id: true,
        shopName: true,
        sellerHandle: true,
        city: true,
        country: true,
        ratingAvg: true,
        ratingCount: true,
      },
    });
    const revenueSellerMap = new Map(revenueSellers.map(s => [s.id, s]));

    for (const row of sellerRevRows) {
      if (!sellerRevMap[row.sellerId]) {
        const sellerInfo = revenueSellerMap.get(row.sellerId);
        sellerRevMap[row.sellerId] = {
          sellerId: row.sellerId,
          shopName: sellerInfo?.shopName || null,
          handle: sellerInfo?.sellerHandle || null,
          city: sellerInfo?.city || null,
          country: sellerInfo?.country || null,
          netRevenue7d: 0,
          ratingAvg: sellerInfo?.ratingAvg ?? 0,
          ratingCount: sellerInfo?.ratingCount ?? 0,
        };
      }
      sellerRevMap[row.sellerId].netRevenue7d += Number(row.netAmount);
    }

    const topSellersByRevenue = Object.values(sellerRevMap)
      .sort((a, b) => b.netRevenue7d - a.netRevenue7d)
      .slice(0, 10);

    // ---------------------------
    // 4. High-dispute sellers (risk)
    //
    // We'll look at last 30 days:
    // disputeRate = disputes / sold items.
    // We'll return top ~10 worst performers sorted by disputeRate desc,
    // but only include sellers who've actually sold something.
    // ---------------------------
    // count sold items per seller in last 30d
    const soldCounts = await this.prisma.orderItem.groupBy({
      by: ['sellerId'],
      where: {
        createdAt: { gte: since30 },
        order: { status: 'PAID' },
      },
      _count: {
        _all: true,
      },
    });

    // count disputes per seller in last 30d (excluding REJECTED)
    const disputeCounts = await this.prisma.dispute.groupBy({
      by: ['orderItemId'],
      where: {
        createdAt: { gte: since30 },
        status: { not: 'REJECTED' },
      },
      _count: {
        _all: true,
      },
    });

    // disputeCounts is grouped by dispute.orderItemId; we actually want sellerId
    // We'll load those orderItems to map back to sellerId
    let riskMap: Record<
      string,
      {
        sellerId: string;
        disputes: number;
        sold: number;
        disputeRatePct: number;
        shopName: string | null;
        handle: string | null;
        city: string | null;
        country: string | null;
      }
    > = {};

    // Build seller sold counts
    for (const s of soldCounts) {
      riskMap[s.sellerId] = {
        sellerId: s.sellerId,
        disputes: 0,
        sold: s._count._all,
        disputeRatePct: 0,
        shopName: null,
        handle: null,
        city: null,
        country: null,
      };
    }

    // For each dispute row, lookup that orderItem's sellerId and increment
    for (const d of disputeCounts) {
      const oi = await this.prisma.orderItem.findUnique({
        where: { id: d.orderItemId },
        select: {
          sellerId: true,
        },
      });
      if (!oi) continue;
      if (!riskMap[oi.sellerId]) {
        riskMap[oi.sellerId] = {
          sellerId: oi.sellerId,
          disputes: 0,
          sold: 0,
          disputeRatePct: 0,
          shopName: null,
          handle: null,
          city: null,
          country: null,
        };
      }
      riskMap[oi.sellerId].disputes += d._count._all;
    }

    // Enrich seller metadata and compute disputeRatePct
    for (const sellerId of Object.keys(riskMap)) {
      const info = await this.prisma.user.findUnique({
        where: { id: sellerId },
        select: {
          shopName: true,
          sellerHandle: true,
          city: true,
          country: true,
        },
      });
      const sold = riskMap[sellerId].sold;
      const disputes = riskMap[sellerId].disputes;
      riskMap[sellerId].shopName = info?.shopName || null;
      riskMap[sellerId].handle = info?.sellerHandle || null;
      riskMap[sellerId].city = info?.city || null;
      riskMap[sellerId].country = info?.country || null;
      riskMap[sellerId].disputeRatePct =
        sold === 0 ? 0 : (disputes / sold) * 100;
    }

    // sort by highest disputeRatePct but require sold>0
    const highDisputeSellers = Object.values(riskMap)
      .filter((s) => s.sold > 0)
      .sort((a, b) => b.disputeRatePct - a.disputeRatePct)
      .slice(0, 10);

    // ---------------------------
    // 5. Outstanding payout liability
    //
    // Sum of all seller netAmount where payoutStatus = PENDING
    // and fulfillmentStatus is DELIVERED (or maybe DELIVERED/ISSUE? up to policy).
    // We'll treat DELIVERED only, so we don't plan to pay out items under dispute.
    // ---------------------------
    const unpaid = await this.prisma.orderItem.findMany({
      where: {
        payoutStatus: 'PENDING',
        fulfillmentStatus: 'DELIVERED',
      },
      select: {
        sellerId: true,
        netAmount: true,
        currency: true,
      },
    });

    let totalLiability = 0;
    let liabilityCurrency = unpaid[0]?.currency || 'USD';

    const liabilityPerSeller: Record<
      string,
      { sellerId: string; amount: number }
    > = {};

    for (const row of unpaid) {
      totalLiability += Number(row.netAmount);
      if (!liabilityPerSeller[row.sellerId]) {
        liabilityPerSeller[row.sellerId] = {
          sellerId: row.sellerId,
          amount: 0,
        };
      }
      liabilityPerSeller[row.sellerId].amount += Number(row.netAmount);
    }

    // turn into array sorted by amount desc
    const topLiabilitySellers = Object.values(liabilityPerSeller)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    // also enrich each with seller info for the UI
    const liabilityDetailed = [];
    for (const li of topLiabilitySellers) {
      const info = await this.prisma.user.findUnique({
        where: { id: li.sellerId },
        select: {
          shopName: true,
          sellerHandle: true,
          city: true,
          country: true,
        },
      });
      liabilityDetailed.push({
        sellerId: li.sellerId,
        shopName: info?.shopName || null,
        handle: info?.sellerHandle || null,
        city: info?.city || null,
        country: info?.country || null,
        amount: li.amount,
      });
    }

    // final payload
    return {
      windowDaysGMV: 7,
      windowDaysDispute: 30,

      gmvByCity: gmvByCityArr, // [{cityLabel, gmv, currency}, ...]
      topCategories, // [{category, gmv}, ...]

      topSellersByRevenue, // [{shopName, handle, netRevenue7d, ratingAvg, ...}, ...]

      highDisputeSellers, // [{shopName, handle, disputeRatePct, sold, disputes, city, ...}, ...]

      payoutLiability: {
        totalLiability,
        currency: liabilityCurrency,
        topOwed: liabilityDetailed, // [{shopName, handle, amount, city, ...}, ...]
      },
    };
  }
}
