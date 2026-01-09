import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsSellerService {
  constructor(private prisma: PrismaService) {}

  async getProfitabilityMetrics(sellerId: string) {
    // Get order data for the seller
    const orders = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId,
            },
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Calculate metrics
    let totalRevenue = 0;
    let totalCost = 0;
    let totalFees = 0;
    let totalShipping = 0;
    let totalPromos = 0;
    let orderCount = orders.length;

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product.sellerId === sellerId) {
          totalRevenue += item.price.toNumber() * item.qty;
          // In a real implementation, you would calculate actual costs
          totalCost += item.product.price.toNumber() * 0.6 * item.qty; // Example: 60% cost of goods
          totalFees += item.price.toNumber() * 0.1 * item.qty; // Example: 10% marketplace fee
        }
      });
    });

    const grossProfit = totalRevenue - totalCost;
    const netProfit = grossProfit - totalFees - totalShipping - totalPromos;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalCost,
      totalFees,
      totalShipping,
      totalPromos,
      grossProfit,
      netProfit,
      profitMargin,
      orderCount,
    };
  }

  async getOrdersWithFeeBreakdown(sellerId: string, limit: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId,
            },
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    // Add fee breakdown to each order
    return orders.map(order => {
      let itemRevenue = 0;
      let itemFees = 0;
      
      order.items.forEach(item => {
        if (item.product.sellerId === sellerId) {
          itemRevenue += item.price.toNumber() * item.qty;
          itemFees += item.price.toNumber() * 0.1 * item.qty; // Example: 10% marketplace fee
        }
      });

      return {
        ...order,
        itemRevenue,
        itemFees,
        netRevenue: itemRevenue - itemFees,
      };
    });
  }

  async simulatePricingScenario(
    sellerId: string,
    scenario: {
      feeChange?: number;
      bundleDiscount?: number;
      productId?: string;
    },
  ) {
    // Get current metrics
    const currentMetrics = await this.getProfitabilityMetrics(sellerId);
    
    // Simulate fee change
    let simulatedFees = currentMetrics.totalFees;
    if (scenario.feeChange !== undefined) {
      simulatedFees = currentMetrics.totalRevenue * (scenario.feeChange / 100);
    }
    
    // Simulate bundle discount
    let simulatedRevenue = currentMetrics.totalRevenue;
    if (scenario.bundleDiscount !== undefined) {
      simulatedRevenue = currentMetrics.totalRevenue * (1 - scenario.bundleDiscount / 100);
    }
    
    // Calculate simulated profit
    const simulatedGrossProfit = simulatedRevenue - currentMetrics.totalCost;
    const simulatedNetProfit = simulatedGrossProfit - simulatedFees - currentMetrics.totalShipping - currentMetrics.totalPromos;
    const simulatedProfitMargin = simulatedRevenue > 0 ? (simulatedNetProfit / simulatedRevenue) * 100 : 0;
    
    return {
      current: currentMetrics,
      simulated: {
        totalRevenue: simulatedRevenue,
        totalCost: currentMetrics.totalCost,
        totalFees: simulatedFees,
        totalShipping: currentMetrics.totalShipping,
        totalPromos: currentMetrics.totalPromos,
        grossProfit: simulatedGrossProfit,
        netProfit: simulatedNetProfit,
        profitMargin: simulatedProfitMargin,
        orderCount: currentMetrics.orderCount,
      },
      difference: {
        totalRevenue: simulatedRevenue - currentMetrics.totalRevenue,
        netProfit: simulatedNetProfit - currentMetrics.netProfit,
        profitMargin: simulatedProfitMargin - currentMetrics.profitMargin,
      },
    };
  }

  async getRecentOrders(sellerId: string, limit = 10) {
    const orders = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId,
            },
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    // Add fee breakdown to each order
    return orders.map(order => {
      let itemRevenue = 0;
      let itemFees = 0;
      
      order.items.forEach(item => {
        if (item.product.sellerId === sellerId) {
          itemRevenue += item.price.toNumber() * item.qty;
          itemFees += item.price.toNumber() * 0.1 * item.qty; // Example: 10% marketplace fee
        }
      });

      return {
        ...order,
        itemRevenue,
        itemFees,
        netRevenue: itemRevenue - itemFees,
      };
    });
  }

  async getInventoryVelocityMetrics(sellerId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        sellerId,
      },
      include: {
        inventory: true,
        _count: {
          select: {
            orderItems: {
              where: {
                order: {
                  createdAt: {
                    gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
                  },
                },
              },
            },
          },
        },
      },
    });

    // Calculate velocity metrics for each product
    const productMetrics = products.map(product => {
      const totalSold = product._count.orderItems;
      const daysInPeriod = 90;
      const dailySalesRate = totalSold / daysInPeriod;
      const currentInventory = product.inventory?.quantity || 0;
      const daysOfSupply = dailySalesRate > 0 ? currentInventory / dailySalesRate : 0;
      
      return {
        productId: product.id,
        productName: product.title,
        currentInventory,
        totalSold,
        dailySalesRate,
        daysOfSupply,
        velocity: dailySalesRate, // Items sold per day
        status: daysOfSupply > 30 ? 'slow' : daysOfSupply < 7 ? 'fast' : 'normal',
      };
    });

    // Aggregate metrics
    const totalInventory = productMetrics.reduce((sum, p) => sum + p.currentInventory, 0);
    const totalSold = productMetrics.reduce((sum, p) => sum + p.totalSold, 0);
    const avgDaysOfSupply = productMetrics.length > 0 ? productMetrics.reduce((sum, p) => sum + p.daysOfSupply, 0) / productMetrics.length : 0;
    
    return {
      products: productMetrics,
      aggregate: {
        totalInventory,
        totalSold,
        avgDaysOfSupply,
        slowMovingItems: productMetrics.filter(p => p.status === 'slow').length,
        fastMovingItems: productMetrics.filter(p => p.status === 'fast').length,
      },
    };
  }

  async getBuyerCohorts(sellerId: string) {
    // Get all buyers who purchased from this seller
    const buyerOrders = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId,
            },
          },
        },
      },
      include: {
        user: true,
        items: {
          where: {
            product: {
              sellerId,
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group buyers by first purchase date (cohort analysis)
    const cohorts: Record<string, any> = {};
    
    buyerOrders.forEach(order => {
      const firstPurchaseDate = new Date(order.user.createdAt);
      const cohortKey = `${firstPurchaseDate.getFullYear()}-${firstPurchaseDate.getMonth() + 1}`;
      
      if (!cohorts[cohortKey]) {
        cohorts[cohortKey] = {
          period: cohortKey,
          buyerCount: 0,
          totalRevenue: 0,
          repeatBuyers: 0,
          orders: [],
        };
      }
      
      cohorts[cohortKey].buyerCount += 1;
      cohorts[cohortKey].totalRevenue += order.items.reduce((sum, item) => sum + (item.price.toNumber() * item.qty), 0);
      cohorts[cohortKey].orders.push({
        orderId: order.id,
        userId: order.userId,
        orderDate: order.createdAt,
        orderValue: order.items.reduce((sum, item) => sum + (item.price.toNumber() * item.qty), 0),
      });
    });

    // Calculate retention rates
    const cohortAnalysis = Object.values(cohorts).map((cohort: any) => {
      const uniqueBuyers = new Set(cohort.orders.map((o: any) => o.userId));
      const repeatBuyers = cohort.orders.length - uniqueBuyers.size;
      
      return {
        ...cohort,
        uniqueBuyers: uniqueBuyers.size,
        repeatBuyers,
        retentionRate: uniqueBuyers.size > 0 ? (repeatBuyers / uniqueBuyers.size) * 100 : 0,
      };
    });

    return cohortAnalysis;
  }

  async getBuyerSegments(sellerId: string) {
    // Get all buyers who purchased from this seller
    const buyerOrders = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId,
            },
          },
        },
      },
      include: {
        user: {
          include: {
            orders: {
              include: {
                items: true,
              },
            },
          },
        },
        items: {
          where: {
            product: {
              sellerId,
            },
          },
        },
      },
    });

    // Segment buyers based on behavior
    const segments: Record<string, any> = {
      highValue: { name: 'High-Value Customers', buyers: [], criteria: 'Orders > $200' },
      frequent: { name: 'Frequent Buyers', buyers: [], criteria: 'Orders > 3' },
      seasonal: { name: 'Seasonal Shoppers', buyers: [], criteria: 'Recent orders only' },
      atRisk: { name: 'At-Risk Customers', buyers: [], criteria: 'No orders in 60 days' },
    };

    const userIds = new Set();
    const userMap: Record<string, any> = {};

    buyerOrders.forEach(order => {
      const userId = order.userId;
      if (!userIds.has(userId)) {
        userIds.add(userId);
        const userOrders = order.user.orders.filter(o =>
          o.items.some(item => item.sellerId === sellerId)
        );

        const totalSpent = userOrders.reduce((sum, o) =>
          sum + o.items.reduce((itemSum, item) =>
            itemSum + (item.sellerId === sellerId ? item.price.toNumber() * item.qty : 0), 0
          ), 0
        );
        
        const orderCount = userOrders.length;
        const lastOrderDate = new Date(Math.max(...userOrders.map(o => new Date(o.createdAt).getTime())));
        const daysSinceLastOrder = (Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24);
        
        userMap[userId] = {
          id: userId,
          name: order.user.name,
          email: order.user.email,
          totalSpent,
          orderCount,
          lastOrderDate,
          daysSinceLastOrder,
        };
      }
    });

    // Categorize buyers into segments
    Object.values(userMap).forEach((user: any) => {
      if (user.totalSpent > 200) {
        segments.highValue.buyers.push(user);
      }
      if (user.orderCount > 3) {
        segments.frequent.buyers.push(user);
      }
      if (user.daysSinceLastOrder > 60) {
        segments.atRisk.buyers.push(user);
      }
      // Seasonal shoppers would be determined by more complex logic in a real implementation
    });

    return Object.values(segments);
  }

  async generateDiscountCampaign(
    sellerId: string,
    segmentId: string,
    discountData: {
      discountPercentage: number;
      durationDays: number;
      maxUses?: number;
    },
  ) {
    // In a real implementation, this would create a discount campaign in the database
    // For now, we'll return a mock response
    return {
      id: `campaign-${Date.now()}`,
      sellerId,
      segmentId,
      discountPercentage: discountData.discountPercentage,
      durationDays: discountData.durationDays,
      maxUses: discountData.maxUses || 100,
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + discountData.durationDays * 24 * 60 * 60 * 1000),
      redemptionCount: 0,
    };
  }

  async getInventoryRiskAnalysis(sellerId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        sellerId,
      },
      include: {
        inventory: true,
        _count: {
          select: {
            orderItems: {
              where: {
                order: {
                  createdAt: {
                    gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
                  },
                },
              },
            },
          },
        },
      },
    });

    // Analyze inventory risks
    const riskMetrics = products.map(product => {
      const totalSold = product._count.orderItems;
      const daysInPeriod = 90;
      const dailySalesRate = totalSold / daysInPeriod;
      const currentInventory = product.inventory?.quantity || 0;
      const daysOfSupply = dailySalesRate > 0 ? currentInventory / dailySalesRate : 0;
      
      // Calculate average rating (simplified)
      const avgRating = product._count.orderItems > 0 ? 4.5 : 0; // Simplified for demo
      
      // Risk factors
      const agingRisk = product.createdAt < new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) ? 0.8 : 0.2;
      const velocityRisk = daysOfSupply > 30 ? 0.9 : daysOfSupply < 7 ? 0.3 : 0.6;
      const ratingRisk = avgRating < 3 ? 0.9 : avgRating < 4 ? 0.6 : 0.2;
      
      // Overall risk score (0-100)
      const riskScore = Math.round((agingRisk + velocityRisk + ratingRisk) / 3 * 100);
      
      return {
        productId: product.id,
        productName: product.title,
        currentInventory,
        daysOfSupply,
        avgRating,
        riskScore,
        riskLevel: riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low',
        riskFactors: {
          aging: agingRisk,
          velocity: velocityRisk,
          rating: ratingRisk,
        },
      };
    });

    // Aggregate risk metrics
    const highRiskItems = riskMetrics.filter(item => item.riskLevel === 'high').length;
    const mediumRiskItems = riskMetrics.filter(item => item.riskLevel === 'medium').length;
    const lowRiskItems = riskMetrics.filter(item => item.riskLevel === 'low').length;
    
    return {
      products: riskMetrics,
      aggregate: {
        totalProducts: riskMetrics.length,
        highRiskItems,
        mediumRiskItems,
        lowRiskItems,
        riskDistribution: {
          high: riskMetrics.length > 0 ? (highRiskItems / riskMetrics.length) * 100 : 0,
          medium: riskMetrics.length > 0 ? (mediumRiskItems / riskMetrics.length) * 100 : 0,
          low: riskMetrics.length > 0 ? (lowRiskItems / riskMetrics.length) * 100 : 0,
        },
      },
    };
  }

  async getAgingInventory(sellerId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        sellerId,
      },
      include: {
        inventory: true,
      },
    });

    // Identify aging inventory (products not sold in last 90 days)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    
    const agingProducts = products.filter(product => 
      product.createdAt < ninetyDaysAgo
    ).map(product => {
      const ageInDays = Math.floor((Date.now() - product.createdAt.getTime()) / (1000 * 60 * 60 * 24));
      return {
        productId: product.id,
        productName: product.title,
        currentInventory: product.inventory?.quantity || 0,
        ageInDays,
        status: ageInDays > 180 ? 'very_old' : ageInDays > 90 ? 'old' : 'maturing',
      };
    });

    return agingProducts;
  }

  async getStockoutPredictions(sellerId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        sellerId,
      },
      include: {
        inventory: true,
        orderItems: {
          where: {
            order: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              },
            },
          },
        },
      },
    });

    // Predict stockouts based on recent sales velocity
    const stockoutPredictions = products.map(product => {
      const totalSoldLast30Days = product.orderItems.reduce((sum, item) => sum + item.qty, 0);
      const dailySalesRate = totalSoldLast30Days / 30;
      const currentInventory = product.inventory?.quantity || 0;
      const daysUntilStockout = dailySalesRate > 0 ? Math.floor(currentInventory / dailySalesRate) : 0;
      
      return {
        productId: product.id,
        productName: product.title,
        currentInventory,
        dailySalesRate,
        daysUntilStockout,
        riskOfStockout: daysUntilStockout < 7 ? 'high' : daysUntilStockout < 14 ? 'medium' : 'low',
        recommendedRestock: dailySalesRate > 0 ? Math.ceil(dailySalesRate * 14) : 0, // 2 weeks of inventory
      };
    }).filter(prediction => prediction.daysUntilStockout < 30); // Only show items that might stock out soon

    return stockoutPredictions;
  }

  async generateInventoryRecommendations(sellerId: string, productId?: string) {
    // Get risk analysis
    const riskAnalysis = await this.getInventoryRiskAnalysis(sellerId);
    
    // Get stockout predictions
    const stockoutPredictions = await this.getStockoutPredictions(sellerId);
    
    // Get aging inventory
    const agingInventory = await this.getAgingInventory(sellerId);
    
    // Generate recommendations
    const recommendations = [];
    
    // Markdown recommendations for high-risk items
    riskAnalysis.products
      .filter(item => item.riskLevel === 'high')
      .forEach(item => {
        recommendations.push({
          type: 'markdown',
          productId: item.productId,
          productName: item.productName,
          action: 'Apply discount to move inventory',
          discountPercentage: 20,
          reason: `High risk score (${item.riskScore}) due to low velocity and/or poor ratings`,
        });
      });
    
    // Restock recommendations for items at risk of stockout
    stockoutPredictions
      .filter(prediction => prediction.riskOfStockout === 'high')
      .forEach(prediction => {
        recommendations.push({
          type: 'restock',
          productId: prediction.productId,
          productName: prediction.productName,
          action: 'Restock inventory',
          quantity: prediction.recommendedRestock,
          reason: `Predicted to stock out in ${prediction.daysUntilStockout} days`,
        });
      });
    
    // Bundle recommendations for aging inventory
    agingInventory
      .filter(item => item.status === 'old' || item.status === 'very_old')
      .forEach(item => {
        recommendations.push({
          type: 'bundle',
          productId: item.productId,
          productName: item.productName,
          action: 'Create bundle offer',
          reason: `Product is ${item.ageInDays} days old`,
        });
      });
    
    return recommendations;
  }

  async getTopSellingProducts(sellerId: string, limit = 10) {
    const products = await this.prisma.product.findMany({
      where: {
        sellerId,
      },
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
        inventory: true,
      },
      orderBy: {
        orderItems: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    // Calculate total sold for each product
    const productSales = products.map(product => {
      const totalSold = product._count.orderItems;
      
      return {
        ...product,
        totalSold,
      };
    });

    return productSales;
  }

}