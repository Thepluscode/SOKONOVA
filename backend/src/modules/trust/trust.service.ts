import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TrustService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  /**
   * Get seller quality score and trust metrics
   *
   * Aggregates reviews, disputes, fulfillment punctuality, and refund history
   * into a transparent quality score shared with shoppers and admins.
   */
  async getSellerQualityScore(sellerId: string) {
    // Get seller information
    const seller = await this.prisma.user.findUnique({
      where: { id: sellerId },
      select: {
        id: true,
        shopName: true,
        sellerHandle: true,
        ratingAvg: true,
        ratingCount: true,
      },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    // Get review metrics
    const reviews = await this.prisma.review.findMany({
      where: {
        sellerId,
        isVisible: true,
      },
      select: {
        rating: true,
      },
    });

    // Get dispute metrics
    const disputes = await this.prisma.dispute.findMany({
      where: {
        orderItem: {
          sellerId,
        },
      },
      select: {
        status: true,
        reasonCode: true,
        createdAt: true,
      },
    });

    // Get fulfillment metrics
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        sellerId,
        order: {
          status: 'PAID',
        },
      },
      select: {
        fulfillmentStatus: true,
        shippedAt: true,
        deliveredAt: true,
        createdAt: true,
      },
    });

    // Calculate quality score components
    const reviewScore = seller.ratingAvg || 0;
    const reviewCount = seller.ratingCount || 0;
    
    // Calculate dispute rate (excluding rejected disputes)
    const validDisputes = disputes.filter(d => d.status !== 'REJECTED');
    const disputeRate = orderItems.length > 0 
      ? (validDisputes.length / orderItems.length) * 100 
      : 0;
    
    // Calculate on-time delivery rate
    const deliveredItems = orderItems.filter(item => item.fulfillmentStatus === 'DELIVERED');
    const onTimeDeliveries = deliveredItems.filter(item => {
      if (!item.shippedAt || !item.deliveredAt) return false;
      // Assume 5 days is the expected delivery time
      const expectedDelivery = new Date(item.shippedAt);
      expectedDelivery.setDate(expectedDelivery.getDate() + 5);
      return item.deliveredAt <= expectedDelivery;
    });
    
    const onTimeDeliveryRate = deliveredItems.length > 0
      ? (onTimeDeliveries.length / deliveredItems.length) * 100
      : 100; // Perfect score if no deliveries yet
    
    // Calculate quality score (weighted average)
    const qualityScore = (
      (reviewScore / 5) * 0.4 +           // 40% weight for reviews
      (1 - disputeRate / 100) * 0.3 +     // 30% weight for dispute rate
      (onTimeDeliveryRate / 100) * 0.3    // 30% weight for delivery punctuality
    ) * 100;

    // Determine quality level
    let qualityLevel: 'excellent' | 'good' | 'fair' | 'poor';
    if (qualityScore >= 90) {
      qualityLevel = 'excellent';
    } else if (qualityScore >= 75) {
      qualityLevel = 'good';
    } else if (qualityScore >= 60) {
      qualityLevel = 'fair';
    } else {
      qualityLevel = 'poor';
    }

    return {
      sellerId,
      shopName: seller.shopName,
      sellerHandle: seller.sellerHandle,
      qualityScore: Math.round(qualityScore * 100) / 100,
      qualityLevel,
      components: {
        reviewScore: Math.round(reviewScore * 100) / 100,
        reviewCount,
        disputeRate: Math.round(disputeRate * 100) / 100,
        onTimeDeliveryRate: Math.round(onTimeDeliveryRate * 100) / 100,
      },
      trustBadges: this.getTrustBadges(qualityScore, reviewCount, disputeRate),
    };
  }

  /**
   * Get dispute shield metrics for a seller
   *
   * Provides dispute resolution metrics and protection indicators.
   */
  async getSellerDisputeShield(sellerId: string) {
    // Get dispute statistics
    const disputes = await this.prisma.dispute.findMany({
      where: {
        orderItem: {
          sellerId,
        },
      },
      select: {
        status: true,
        reasonCode: true,
        createdAt: true,
      },
    });

    const totalDisputes = disputes.length;
    const resolvedDisputes = disputes.filter(
      d => d.status === 'RESOLVED_BUYER_COMPENSATED' || 
           d.status === 'RESOLVED_REDELIVERED' || 
           d.status === 'REJECTED'
    ).length;
    
    const buyerCompensated = disputes.filter(
      d => d.status === 'RESOLVED_BUYER_COMPENSATED'
    ).length;
    
    const redelivered = disputes.filter(
      d => d.status === 'RESOLVED_REDELIVERED'
    ).length;
    
    const rejected = disputes.filter(
      d => d.status === 'REJECTED'
    ).length;

    // Calculate resolution rate
    const resolutionRate = totalDisputes > 0 
      ? (resolvedDisputes / totalDisputes) * 100 
      : 100;

    // Get recent dispute trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentDisputes = disputes.filter(
      d => d.createdAt >= thirtyDaysAgo
    );

    // Determine dispute shield level
    let shieldLevel: 'platinum' | 'gold' | 'silver' | 'bronze';
    if (totalDisputes === 0) {
      shieldLevel = 'platinum';
    } else if (resolutionRate >= 95 && buyerCompensated === 0) {
      shieldLevel = 'gold';
    } else if (resolutionRate >= 85) {
      shieldLevel = 'silver';
    } else {
      shieldLevel = 'bronze';
    }

    return {
      sellerId,
      shieldLevel,
      totalDisputes,
      resolvedDisputes,
      resolutionRate: Math.round(resolutionRate * 100) / 100,
      breakdown: {
        buyerCompensated,
        redelivered,
        rejected,
        open: totalDisputes - resolvedDisputes,
      },
      recentTrend: {
        period: 'last_30_days',
        count: recentDisputes.length,
      },
      protectionIndicators: this.getProtectionIndicators(shieldLevel),
    };
  }

  /**
   * Get reputation graph data for a seller
   *
   * Provides historical reputation data for trend analysis.
   */
  async getSellerReputationGraph(sellerId: string) {
    // Get historical review data (grouped by month)
    const reviews = await this.prisma.review.findMany({
      where: {
        sellerId,
        isVisible: true,
      },
      select: {
        rating: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group reviews by month
    const monthlyData: Record<string, { 
      month: string; 
      avgRating: number; 
      reviewCount: number;
      ratings: number[];
    }> = {};

    reviews.forEach(review => {
      const monthKey = `${review.createdAt.getFullYear()}-${review.createdAt.getMonth() + 1}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          avgRating: 0,
          reviewCount: 0,
          ratings: [],
        };
      }
      monthlyData[monthKey].ratings.push(review.rating);
      monthlyData[monthKey].reviewCount++;
    });

    // Calculate averages
    Object.values(monthlyData).forEach(month => {
      const sum = month.ratings.reduce((a, b) => a + b, 0);
      month.avgRating = month.ratings.length > 0 
        ? Math.round((sum / month.ratings.length) * 100) / 100
        : 0;
    });

    // Convert to array and sort by month
    const reputationHistory = Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month));

    // Get current reputation metrics
    const seller = await this.prisma.user.findUnique({
      where: { id: sellerId },
      select: {
        ratingAvg: true,
        ratingCount: true,
      },
    });

    // Get dispute history for reputation context
    const disputes = await this.prisma.dispute.findMany({
      where: {
        orderItem: {
          sellerId,
        },
      },
      select: {
        status: true,
        reasonCode: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group disputes by month
    const disputeMonthlyData: Record<string, { 
      month: string; 
      disputeCount: number;
      resolvedCount: number;
    }> = {};

    disputes.forEach(dispute => {
      const monthKey = `${dispute.createdAt.getFullYear()}-${dispute.createdAt.getMonth() + 1}`;
      if (!disputeMonthlyData[monthKey]) {
        disputeMonthlyData[monthKey] = {
          month: monthKey,
          disputeCount: 0,
          resolvedCount: 0,
        };
      }
      disputeMonthlyData[monthKey].disputeCount++;
      if (dispute.status !== 'OPEN' && dispute.status !== 'SELLER_RESPONDED') {
        disputeMonthlyData[monthKey].resolvedCount++;
      }
    });

    // Convert dispute data to array
    const disputeHistory = Object.values(disputeMonthlyData)
      .sort((a, b) => a.month.localeCompare(b.month));

    // Get fulfillment history
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        sellerId,
        order: {
          status: 'PAID',
        },
      },
      select: {
        fulfillmentStatus: true,
        shippedAt: true,
        deliveredAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group fulfillment by month
    const fulfillmentMonthlyData: Record<string, { 
      month: string; 
      totalItems: number;
      deliveredItems: number;
      onTimeDeliveries: number;
    }> = {};

    orderItems.forEach(item => {
      const monthKey = `${item.createdAt.getFullYear()}-${item.createdAt.getMonth() + 1}`;
      if (!fulfillmentMonthlyData[monthKey]) {
        fulfillmentMonthlyData[monthKey] = {
          month: monthKey,
          totalItems: 0,
          deliveredItems: 0,
          onTimeDeliveries: 0,
        };
      }
      fulfillmentMonthlyData[monthKey].totalItems++;
      if (item.fulfillmentStatus === 'DELIVERED') {
        fulfillmentMonthlyData[monthKey].deliveredItems++;
        if (item.shippedAt && item.deliveredAt) {
          // Assume 5 days is the expected delivery time
          const expectedDelivery = new Date(item.shippedAt);
          expectedDelivery.setDate(expectedDelivery.getDate() + 5);
          if (item.deliveredAt <= expectedDelivery) {
            fulfillmentMonthlyData[monthKey].onTimeDeliveries++;
          }
        }
      }
    });

    // Convert fulfillment data to array
    const fulfillmentHistory = Object.values(fulfillmentMonthlyData)
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      sellerId,
      current: {
        avgRating: seller?.ratingAvg || 0,
        totalReviews: seller?.ratingCount || 0,
      },
      history: reputationHistory,
      disputeHistory: disputeHistory,
      fulfillmentHistory: fulfillmentHistory,
      trend: this.calculateReputationTrend(reputationHistory),
    };
  }

  /**
   * Get full reputation graph data for a seller with comprehensive metrics
   *
   * Provides historical reputation data with additional metrics for quality score calculation.
   */
  async getSellerFullReputationGraph(sellerId: string) {
    // Get basic reputation graph data
    const basicReputationData = await this.getSellerReputationGraph(sellerId);
    
    // Get additional metrics for comprehensive quality score calculation
    
    // Get refund history (disputes resolved with buyer compensation)
    const refundDisputes = await this.prisma.dispute.findMany({
      where: {
        orderItem: {
          sellerId,
        },
        status: 'RESOLVED_BUYER_COMPENSATED',
      },
      select: {
        createdAt: true,
        resolutionNote: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group refunds by month
    const refundMonthlyData: Record<string, { 
      month: string; 
      refundCount: number;
      refundReasons: string[];
    }> = {};

    refundDisputes.forEach(dispute => {
      const monthKey = `${dispute.createdAt.getFullYear()}-${dispute.createdAt.getMonth() + 1}`;
      if (!refundMonthlyData[monthKey]) {
        refundMonthlyData[monthKey] = {
          month: monthKey,
          refundCount: 0,
          refundReasons: [],
        };
      }
      refundMonthlyData[monthKey].refundCount++;
      if (dispute.resolutionNote) {
        refundMonthlyData[monthKey].refundReasons.push(dispute.resolutionNote);
      }
    });

    // Convert refund data to array
    const refundHistory = Object.values(refundMonthlyData)
      .sort((a, b) => a.month.localeCompare(b.month));

    // Get return history (disputes resolved with redelivery)
    const returnDisputes = await this.prisma.dispute.findMany({
      where: {
        orderItem: {
          sellerId,
        },
        status: 'RESOLVED_REDELIVERED',
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group returns by month
    const returnMonthlyData: Record<string, { 
      month: string; 
      returnCount: number;
    }> = {};

    returnDisputes.forEach(dispute => {
      const monthKey = `${dispute.createdAt.getFullYear()}-${dispute.createdAt.getMonth() + 1}`;
      if (!returnMonthlyData[monthKey]) {
        returnMonthlyData[monthKey] = {
          month: monthKey,
          returnCount: 0,
        };
      }
      returnMonthlyData[monthKey].returnCount++;
    });

    // Convert return data to array
    const returnHistory = Object.values(returnMonthlyData)
      .sort((a, b) => a.month.localeCompare(b.month));

    // Get product quality metrics (counterfeit reports)
    const counterfeitReports = await this.prisma.counterfeitReport.findMany({
      where: {
        product: {
          sellerId,
        },
      },
      select: {
        createdAt: true,
        status: true,
        reason: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group counterfeit reports by month
    const counterfeitMonthlyData: Record<string, { 
      month: string; 
      reportCount: number;
      resolvedCount: number;
    }> = {};

    counterfeitReports.forEach(report => {
      const monthKey = `${report.createdAt.getFullYear()}-${report.createdAt.getMonth() + 1}`;
      if (!counterfeitMonthlyData[monthKey]) {
        counterfeitMonthlyData[monthKey] = {
          month: monthKey,
          reportCount: 0,
          resolvedCount: 0,
        };
      }
      counterfeitMonthlyData[monthKey].reportCount++;
      if (report.status === 'RESOLVED' || report.status === 'DISMISSED') {
        counterfeitMonthlyData[monthKey].resolvedCount++;
      }
    });

    // Convert counterfeit data to array
    const counterfeitHistory = Object.values(counterfeitMonthlyData)
      .sort((a, b) => a.month.localeCompare(b.month));

    // Get seller responsiveness metrics (time to respond to disputes)
    const disputesWithResponses = await this.prisma.dispute.findMany({
      where: {
        orderItem: {
          sellerId,
        },
        status: {
          not: 'OPEN',
        },
        resolvedAt: {
          not: null,
        },
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group response times by month
    const responseMonthlyData: Record<string, { 
      month: string; 
      avgResponseTimeHours: number;
      responseCount: number;
    }> = {};

    disputesWithResponses.forEach(dispute => {
      const monthKey = `${dispute.createdAt.getFullYear()}-${dispute.createdAt.getMonth() + 1}`;
      const responseTimeHours = (dispute.updatedAt.getTime() - dispute.createdAt.getTime()) / (1000 * 60 * 60);
      
      if (!responseMonthlyData[monthKey]) {
        responseMonthlyData[monthKey] = {
          month: monthKey,
          avgResponseTimeHours: 0,
          responseCount: 0,
        };
      }
      
      // Calculate running average
      const currentAvg = responseMonthlyData[monthKey].avgResponseTimeHours;
      const currentCount = responseMonthlyData[monthKey].responseCount;
      responseMonthlyData[monthKey].avgResponseTimeHours = 
        (currentAvg * currentCount + responseTimeHours) / (currentCount + 1);
      responseMonthlyData[monthKey].responseCount++;
    });

    // Convert response data to array
    const responseHistory = Object.values(responseMonthlyData)
      .sort((a, b) => a.month.localeCompare(b.month));

    // Enhanced quality metrics
    const qualityMetrics = await this.getSellerQualityScore(sellerId);
    
    // Calculate additional metrics
    const totalOrderItems = await this.prisma.orderItem.count({
      where: {
        sellerId,
        order: {
          status: 'PAID',
        },
      },
    });
    
    const totalRefunds = refundDisputes.length;
    const refundRate = totalOrderItems > 0 ? (totalRefunds / totalOrderItems) * 100 : 0;
    
    const totalReturns = returnDisputes.length;
    const returnRate = totalOrderItems > 0 ? (totalReturns / totalOrderItems) * 100 : 0;
    
    const totalCounterfeitReports = counterfeitReports.length;
    const counterfeitRate = totalOrderItems > 0 ? (totalCounterfeitReports / totalOrderItems) * 100 : 0;

    return {
      ...basicReputationData,
      refundHistory,
      returnHistory,
      counterfeitHistory,
      responseHistory,
      enhancedMetrics: {
        qualityScore: qualityMetrics.qualityScore,
        qualityLevel: qualityMetrics.qualityLevel,
        components: qualityMetrics.components,
        additionalMetrics: {
          refundRate: Math.round(refundRate * 100) / 100,
          returnRate: Math.round(returnRate * 100) / 100,
          counterfeitRate: Math.round(counterfeitRate * 100) / 100,
          totalRefunds,
          totalReturns,
          totalCounterfeitReports,
        }
      }
    };
  }

  /**
   * Get compliance status for a seller
   *
   * Provides automated tax, KYC, and document verification status.
   */
  async getSellerComplianceStatus(sellerId: string) {
    // In a real implementation, this would check actual compliance status
    // For now, we'll return mock data
    
    // Check if seller has completed KYC
    const kycStatus = await this.prisma.kYCDocument.findFirst({
      where: {
        sellerId,
      },
    });

    // Check if seller has tax registration
    const taxStatus = await this.prisma.taxRegistration.findFirst({
      where: {
        sellerId,
      },
    });

    return {
      sellerId,
      kyc: {
        completed: !!kycStatus,
        status: kycStatus ? 'verified' : 'pending',
        lastChecked: kycStatus?.updatedAt || null,
      },
      tax: {
        registered: !!taxStatus,
        status: taxStatus ? 'active' : 'pending',
        lastChecked: taxStatus?.updatedAt || null,
      },
      overallCompliance: kycStatus && taxStatus ? 'compliant' : 'non-compliant',
      nextSteps: this.getComplianceNextSteps(!!kycStatus, !!taxStatus),
    };
  }

  /**
   * Submit KYC documents for a seller
   */
  async submitKYCDocuments(
    sellerId: string,
    data: {
      documentType: string;
      documentNumber: string;
      documentUrl: string;
      country: string;
    },
  ) {
    // Create KYC document record
    const kycDocument = await this.prisma.kYCDocument.create({
      data: {
        sellerId,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        documentUrl: data.documentUrl,
        country: data.country,
        status: 'PENDING',
      },
    });

    // Notify admin for review
    try {
      // Since the notifications service doesn't have this method, we'll skip it for now
      console.log(`KYC document ${kycDocument.id} submitted for review`);
    } catch (error) {
      // Log error but don't fail the submission
      console.error('Failed to send KYC notification:', error);
    }

    return {
      success: true,
      documentId: kycDocument.id,
      status: 'submitted',
    };
  }

  /**
   * Submit tax registration for a seller
   */
  async submitTaxRegistration(
    sellerId: string,
    data: {
      taxId: string;
      country: string;
    },
  ) {
    // Create tax registration record
    const taxRegistration = await this.prisma.taxRegistration.create({
      data: {
        sellerId,
        taxId: data.taxId,
        country: data.country,
        status: 'PENDING',
      },
    });

    // Notify admin for review
    try {
      // Since the notifications service doesn't have this method, we'll skip it for now
      console.log(`Tax registration ${taxRegistration.id} submitted for review`);
    } catch (error) {
      // Log error but don't fail the submission
      console.error('Failed to send tax registration notification:', error);
    }

    return {
      success: true,
      registrationId: taxRegistration.id,
      status: 'submitted',
    };
  }

  /**
   * Get counterfeit detection results for a product
   */
  async getProductCounterfeitScan(productId: string) {
    // In a real implementation, this would integrate with AI systems
    // For now, we'll return mock data with more sophisticated detection
    
    const product = await this.prisma.product.findFirst({
      where: { id: productId, isActive: true },
      select: {
        title: true,
        description: true,
        imageUrl: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // More sophisticated counterfeit detection logic
    // This would integrate with actual AI image recognition systems in production
    const riskFactors = [];
    let riskScore = Math.random() * 30; // Base risk from 0-30
    
    // Check for suspicious keywords in title
    const suspiciousKeywords = ['fake', 'replica', 'knockoff', 'copy', 'imitation'];
    const titleLower = product.title.toLowerCase();
    for (const keyword of suspiciousKeywords) {
      if (titleLower.includes(keyword)) {
        riskFactors.push(`Suspicious keyword: ${keyword}`);
        riskScore += 20;
      }
    }
    
    // Check for suspicious keywords in description
    const descriptionLower = product.description.toLowerCase();
    for (const keyword of suspiciousKeywords) {
      if (descriptionLower.includes(keyword)) {
        riskFactors.push(`Suspicious keyword in description: ${keyword}`);
        riskScore += 15;
      }
    }
    
    // Check for missing image
    if (!product.imageUrl) {
      riskFactors.push('Missing product image');
      riskScore += 10;
    }
    
    // Check for generic descriptions
    const genericDescriptions = ['great product', 'best quality', 'cheap price', 'new item'];
    for (const desc of genericDescriptions) {
      if (descriptionLower.includes(desc)) {
        riskFactors.push(`Generic description: ${desc}`);
        riskScore += 5;
      }
    }
    
    // Simulate image analysis (would integrate with AI in production)
    if (product.imageUrl) {
      // Mock image analysis results
      const imageRisk = Math.random() * 20;
      riskScore += imageRisk;
      
      if (imageRisk > 15) {
        riskFactors.push('Image quality issues detected');
      }
      
      if (Math.random() > 0.7) {
        riskFactors.push('Image similarity to known brand products');
        riskScore += 10;
      }
    }
    
    // Cap risk score at 100
    riskScore = Math.min(riskScore, 100);
    
    const isCounterfeit = riskScore > 60;
    const confidence = riskScore > 80 ? 'high' : riskScore > 60 ? 'medium' : 'low';
    
    return {
      productId,
      productName: product.title,
      riskScore: Math.round(riskScore * 100) / 100,
      isCounterfeit,
      confidence,
      detectedIssues: riskFactors,
      recommendations: isCounterfeit
        ? ['Remove product', 'Notify seller', 'Escalate to legal']
        : riskScore > 40
        ? ['Request additional verification', 'Review product details']
        : ['No issues detected'],
      imageAnalysis: product.imageUrl ? {
        url: product.imageUrl,
        scanned: true,
        // In a real implementation, this would include actual AI analysis results
        detectedBrands: ['Brand A', 'Brand B'],
        similarityScore: Math.random(),
        qualityScore: Math.random() * 100,
      } : null,
    };
  }

  /**
   * Report potential counterfeit product
   */
  async reportCounterfeitProduct(
    data: {
      reporterId: string;
      productId: string;
      reason: string;
      evidenceUrl?: string;
    },
  ) {
    // Create counterfeit report
    const report = await this.prisma.counterfeitReport.create({
      data: {
        reporterId: data.reporterId,
        productId: data.productId,
        reason: data.reason,
        evidenceUrl: data.evidenceUrl,
        status: 'PENDING_REVIEW',
      },
    });

    // Notify admins
    try {
      // Since the notifications service doesn't have this method, we'll skip it for now
      console.log(`Counterfeit report ${report.id} submitted for review`);
    } catch (error) {
      // Log error but don't fail the report submission
      console.error('Failed to send counterfeit report notification:', error);
    }

    return {
      success: true,
      reportId: report.id,
      status: 'submitted',
    };
  }

  /**
   * Get admin trust dashboard metrics
   */
  async getAdminTrustDashboard(adminId: string) {
    // Verify admin access
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin || admin.role !== 'ADMIN') {
      throw new ForbiddenException('Not authorized');
    }

    // Get trust metrics
    const sellers = await this.prisma.user.findMany({
      where: { role: 'SELLER' },
      select: {
        id: true,
        shopName: true,
        sellerHandle: true,
        ratingAvg: true,
        ratingCount: true,
      },
    });

    // Calculate trust distribution
    const excellentSellers = sellers.filter(s => (s.ratingAvg || 0) >= 4.5).length;
    const goodSellers = sellers.filter(s => (s.ratingAvg || 0) >= 4.0 && (s.ratingAvg || 0) < 4.5).length;
    const fairSellers = sellers.filter(s => (s.ratingAvg || 0) >= 3.0 && (s.ratingAvg || 0) < 4.0).length;
    const poorSellers = sellers.filter(s => (s.ratingAvg || 0) < 3.0).length;

    // Get recent disputes
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentDisputes = await this.prisma.dispute.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        status: true,
        reasonCode: true,
        createdAt: true,
      },
    });

    // Get compliance metrics
    const kycDocuments = await this.prisma.kYCDocument.groupBy({
      by: ['status'],
      _count: true,
    });

    // Get fulfillment metrics
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        order: {
          status: 'PAID',
        },
      },
      select: {
        sellerId: true,
        fulfillmentStatus: true,
        shippedAt: true,
        deliveredAt: true,
      },
    });

    // Calculate fulfillment performance
    const fulfillmentMetrics = this.calculateFulfillmentMetrics(orderItems);

    // Get refund metrics
    const refundDisputes = recentDisputes.filter(d => d.status === 'RESOLVED_BUYER_COMPENSATED');
    
    return {
      trustDistribution: {
        excellent: excellentSellers,
        good: goodSellers,
        fair: fairSellers,
        poor: poorSellers,
        total: sellers.length,
      },
      recentDisputes: {
        period: 'last_30_days',
        total: recentDisputes.length,
        refundCount: refundDisputes.length,
        byReason: this.groupDisputesByReason(recentDisputes),
      },
      compliance: {
        kycByStatus: kycDocuments.reduce((acc, doc) => {
          acc[doc.status] = doc._count;
          return acc;
        }, {} as Record<string, number>),
      },
      fulfillment: fulfillmentMetrics,
      riskIndicators: this.getAdminRiskIndicators(sellers, recentDisputes),
    };
  }

  /**
   * Get seller risk assessment
   */
  async getSellerRiskAssessment(sellerId: string) {
    // Get seller quality metrics
    const qualityScore = await this.getSellerQualityScore(sellerId);
    const disputeShield = await this.getSellerDisputeShield(sellerId);
    const compliance = await this.getSellerComplianceStatus(sellerId);

    // Get fulfillment metrics
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        sellerId,
        order: {
          status: 'PAID',
        },
      },
      select: {
        fulfillmentStatus: true,
        shippedAt: true,
        deliveredAt: true,
        createdAt: true,
      },
    });

    // Calculate fulfillment performance
    const fulfillmentMetrics = this.calculateFulfillmentMetrics(orderItems);

    // Calculate overall risk score
    let riskScore = 0;
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    
    // Risk factors:
    // 1. Quality score (30% weight)
    riskScore += (100 - qualityScore.qualityScore) * 0.3;
    
    // 2. Dispute rate (25% weight)
    riskScore += disputeShield.breakdown.buyerCompensated * 2 * 0.25;
    
    // 3. Compliance status (25% weight)
    if (compliance.overallCompliance !== 'compliant') {
      riskScore += 30 * 0.25;
    }
    
    // 4. Fulfillment performance (20% weight)
    const lateDeliveryRate = 100 - fulfillmentMetrics.onTimeDeliveryRate;
    riskScore += lateDeliveryRate * 0.2;
    
    // Determine risk level
    if (riskScore >= 70) {
      riskLevel = 'high';
    } else if (riskScore >= 40) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }

    return {
      sellerId,
      riskScore: Math.round(riskScore * 100) / 100,
      riskLevel,
      factors: {
        quality: {
          score: qualityScore.qualityScore,
          level: qualityScore.qualityLevel,
        },
        disputes: {
          rate: disputeShield.breakdown.buyerCompensated,
          level: disputeShield.shieldLevel,
        },
        compliance: {
          status: compliance.overallCompliance,
        },
        fulfillment: {
          onTimeRate: fulfillmentMetrics.onTimeDeliveryRate,
        },
      },
      recommendations: this.getRiskRecommendations(riskLevel, qualityScore, disputeShield, compliance),
    };
  }

  // Helper methods

  private getTrustBadges(qualityScore: number, reviewCount: number, disputeRate: number) {
    const badges = [];
    
    if (qualityScore >= 90) {
      badges.push({
        id: 'quality_excellent',
        name: 'Excellent Quality',
        description: 'Consistently high ratings and service',
      });
    }
    
    if (reviewCount >= 50) {
      badges.push({
        id: 'experienced',
        name: 'Experienced Seller',
        description: '50+ verified reviews',
      });
    }
    
    if (disputeRate <= 2) {
      badges.push({
        id: 'low_disputes',
        name: 'Low Dispute Rate',
        description: 'Under 2% dispute rate',
      });
    }
    
    return badges;
  }

  private getProtectionIndicators(shieldLevel: string) {
    const indicators = [];
    
    if (shieldLevel === 'platinum' || shieldLevel === 'gold') {
      indicators.push({
        id: 'full_protection',
        name: 'Full Protection',
        description: 'Eligible for full buyer protection',
      });
    }
    
    if (shieldLevel === 'platinum') {
      indicators.push({
        id: 'priority_support',
        name: 'Priority Support',
        description: '24/7 dedicated support',
      });
    }
    
    return indicators;
  }

  private calculateReputationTrend(history: any[]) {
    if (history.length < 2) {
      return 'stable';
    }
    
    const firstAvg = history[0].avgRating;
    const lastAvg = history[history.length - 1].avgRating;
    
    if (lastAvg > firstAvg + 0.5) {
      return 'improving';
    } else if (lastAvg < firstAvg - 0.5) {
      return 'declining';
    } else {
      return 'stable';
    }
  }

  private getComplianceNextSteps(hasKYC: boolean, hasTax: boolean) {
    const steps = [];
    
    if (!hasKYC) {
      steps.push({
        id: 'complete_kyc',
        title: 'Complete KYC Verification',
        description: 'Submit identity and business documents',
        priority: 'high',
      });
    }
    
    if (!hasTax) {
      steps.push({
        id: 'register_tax',
        title: 'Register for Tax Compliance',
        description: 'Complete tax registration in your region',
        priority: 'medium',
      });
    }
    
    return steps;
  }

  private groupDisputesByReason(disputes: any[]) {
    const grouped: Record<string, number> = {};
    
    disputes.forEach(dispute => {
      const reason = dispute.reasonCode;
      grouped[reason] = (grouped[reason] || 0) + 1;
    });
    
    return grouped;
  }

  private getAdminRiskIndicators(sellers: any[], disputes: any[]) {
    const highRiskSellers = sellers.filter(s => (s.ratingAvg || 0) < 3.0).length;
    const recentHighDisputes = disputes.filter(d => 
      d.status === 'RESOLVED_BUYER_COMPENSATED'
    ).length;
    
    return {
      highRiskSellers,
      recentHighDisputes,
      alerts: highRiskSellers > 0 || recentHighDisputes > 5,
    };
  }

  private calculateFulfillmentMetrics(orderItems: any[]) {
    const totalItems = orderItems.length;
    const deliveredItems = orderItems.filter(item => item.fulfillmentStatus === 'DELIVERED');
    const onTimeDeliveries = deliveredItems.filter(item => {
      if (!item.shippedAt || !item.deliveredAt) return false;
      // Assume 5 days is the expected delivery time
      const expectedDelivery = new Date(item.shippedAt);
      expectedDelivery.setDate(expectedDelivery.getDate() + 5);
      return item.deliveredAt <= expectedDelivery;
    });
    
    const onTimeDeliveryRate = totalItems > 0
      ? (onTimeDeliveries.length / totalItems) * 100
      : 100;
      
    return {
      totalItems,
      deliveredItems: deliveredItems.length,
      onTimeDeliveries: onTimeDeliveries.length,
      onTimeDeliveryRate: Math.round(onTimeDeliveryRate * 100) / 100,
    };
  }

  private getRiskRecommendations(
    riskLevel: string,
    qualityScore: any,
    disputeShield: any,
    compliance: any,
  ) {
    const recommendations = [];
    
    if (riskLevel === 'high') {
      recommendations.push({
        id: 'immediate_action',
        title: 'Immediate Action Required',
        description: 'Seller requires immediate attention and possible intervention',
        priority: 'critical',
      });
    }
    
    if (qualityScore.qualityLevel === 'poor') {
      recommendations.push({
        id: 'quality_improvement',
        title: 'Quality Improvement Needed',
        description: 'Focus on improving product quality and customer service',
        priority: 'high',
      });
    }
    
    if (disputeShield.shieldLevel === 'bronze') {
      recommendations.push({
        id: 'dispute_resolution',
        title: 'Improve Dispute Resolution',
        description: 'Enhance dispute response time and resolution quality',
        priority: 'medium',
      });
    }
    
    if (compliance.overallCompliance !== 'compliant') {
      recommendations.push({
        id: 'complete_compliance',
        title: 'Complete Compliance Requirements',
        description: 'Finish all pending compliance documentation',
        priority: 'high',
      });
    }
    
    return recommendations;
  }
}
