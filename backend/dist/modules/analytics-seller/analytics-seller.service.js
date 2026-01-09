"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsSellerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let AnalyticsSellerService = class AnalyticsSellerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfitabilityMetrics(sellerId) {
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
                    totalCost += item.product.price.toNumber() * 0.6 * item.qty;
                    totalFees += item.price.toNumber() * 0.1 * item.qty;
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
    async getOrdersWithFeeBreakdown(sellerId, limit) {
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
        return orders.map(order => {
            let itemRevenue = 0;
            let itemFees = 0;
            order.items.forEach(item => {
                if (item.product.sellerId === sellerId) {
                    itemRevenue += item.price.toNumber() * item.qty;
                    itemFees += item.price.toNumber() * 0.1 * item.qty;
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
    async simulatePricingScenario(sellerId, scenario) {
        const currentMetrics = await this.getProfitabilityMetrics(sellerId);
        let simulatedFees = currentMetrics.totalFees;
        if (scenario.feeChange !== undefined) {
            simulatedFees = currentMetrics.totalRevenue * (scenario.feeChange / 100);
        }
        let simulatedRevenue = currentMetrics.totalRevenue;
        if (scenario.bundleDiscount !== undefined) {
            simulatedRevenue = currentMetrics.totalRevenue * (1 - scenario.bundleDiscount / 100);
        }
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
    async getRecentOrders(sellerId, limit = 10) {
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
        return orders.map(order => {
            let itemRevenue = 0;
            let itemFees = 0;
            order.items.forEach(item => {
                if (item.product.sellerId === sellerId) {
                    itemRevenue += item.price.toNumber() * item.qty;
                    itemFees += item.price.toNumber() * 0.1 * item.qty;
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
    async getInventoryVelocityMetrics(sellerId) {
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
                                        gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        const productMetrics = products.map(product => {
            var _a;
            const totalSold = product._count.orderItems;
            const daysInPeriod = 90;
            const dailySalesRate = totalSold / daysInPeriod;
            const currentInventory = ((_a = product.inventory) === null || _a === void 0 ? void 0 : _a.quantity) || 0;
            const daysOfSupply = dailySalesRate > 0 ? currentInventory / dailySalesRate : 0;
            return {
                productId: product.id,
                productName: product.title,
                currentInventory,
                totalSold,
                dailySalesRate,
                daysOfSupply,
                velocity: dailySalesRate,
                status: daysOfSupply > 30 ? 'slow' : daysOfSupply < 7 ? 'fast' : 'normal',
            };
        });
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
    async getBuyerCohorts(sellerId) {
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
        const cohorts = {};
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
        const cohortAnalysis = Object.values(cohorts).map((cohort) => {
            const uniqueBuyers = new Set(cohort.orders.map((o) => o.userId));
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
    async getBuyerSegments(sellerId) {
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
        const segments = {
            highValue: { name: 'High-Value Customers', buyers: [], criteria: 'Orders > $200' },
            frequent: { name: 'Frequent Buyers', buyers: [], criteria: 'Orders > 3' },
            seasonal: { name: 'Seasonal Shoppers', buyers: [], criteria: 'Recent orders only' },
            atRisk: { name: 'At-Risk Customers', buyers: [], criteria: 'No orders in 60 days' },
        };
        const userIds = new Set();
        const userMap = {};
        buyerOrders.forEach(order => {
            const userId = order.userId;
            if (!userIds.has(userId)) {
                userIds.add(userId);
                const userOrders = order.user.orders.filter(o => o.items.some(item => item.sellerId === sellerId));
                const totalSpent = userOrders.reduce((sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + (item.sellerId === sellerId ? item.price.toNumber() * item.qty : 0), 0), 0);
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
        Object.values(userMap).forEach((user) => {
            if (user.totalSpent > 200) {
                segments.highValue.buyers.push(user);
            }
            if (user.orderCount > 3) {
                segments.frequent.buyers.push(user);
            }
            if (user.daysSinceLastOrder > 60) {
                segments.atRisk.buyers.push(user);
            }
        });
        return Object.values(segments);
    }
    async generateDiscountCampaign(sellerId, segmentId, discountData) {
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
    async getInventoryRiskAnalysis(sellerId) {
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
                                        gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        const riskMetrics = products.map(product => {
            var _a;
            const totalSold = product._count.orderItems;
            const daysInPeriod = 90;
            const dailySalesRate = totalSold / daysInPeriod;
            const currentInventory = ((_a = product.inventory) === null || _a === void 0 ? void 0 : _a.quantity) || 0;
            const daysOfSupply = dailySalesRate > 0 ? currentInventory / dailySalesRate : 0;
            const avgRating = product._count.orderItems > 0 ? 4.5 : 0;
            const agingRisk = product.createdAt < new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) ? 0.8 : 0.2;
            const velocityRisk = daysOfSupply > 30 ? 0.9 : daysOfSupply < 7 ? 0.3 : 0.6;
            const ratingRisk = avgRating < 3 ? 0.9 : avgRating < 4 ? 0.6 : 0.2;
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
    async getAgingInventory(sellerId) {
        const products = await this.prisma.product.findMany({
            where: {
                sellerId,
            },
            include: {
                inventory: true,
            },
        });
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const agingProducts = products.filter(product => product.createdAt < ninetyDaysAgo).map(product => {
            var _a;
            const ageInDays = Math.floor((Date.now() - product.createdAt.getTime()) / (1000 * 60 * 60 * 24));
            return {
                productId: product.id,
                productName: product.title,
                currentInventory: ((_a = product.inventory) === null || _a === void 0 ? void 0 : _a.quantity) || 0,
                ageInDays,
                status: ageInDays > 180 ? 'very_old' : ageInDays > 90 ? 'old' : 'maturing',
            };
        });
        return agingProducts;
    }
    async getStockoutPredictions(sellerId) {
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
                                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                            },
                        },
                    },
                },
            },
        });
        const stockoutPredictions = products.map(product => {
            var _a;
            const totalSoldLast30Days = product.orderItems.reduce((sum, item) => sum + item.qty, 0);
            const dailySalesRate = totalSoldLast30Days / 30;
            const currentInventory = ((_a = product.inventory) === null || _a === void 0 ? void 0 : _a.quantity) || 0;
            const daysUntilStockout = dailySalesRate > 0 ? Math.floor(currentInventory / dailySalesRate) : 0;
            return {
                productId: product.id,
                productName: product.title,
                currentInventory,
                dailySalesRate,
                daysUntilStockout,
                riskOfStockout: daysUntilStockout < 7 ? 'high' : daysUntilStockout < 14 ? 'medium' : 'low',
                recommendedRestock: dailySalesRate > 0 ? Math.ceil(dailySalesRate * 14) : 0,
            };
        }).filter(prediction => prediction.daysUntilStockout < 30);
        return stockoutPredictions;
    }
    async generateInventoryRecommendations(sellerId, productId) {
        const riskAnalysis = await this.getInventoryRiskAnalysis(sellerId);
        const stockoutPredictions = await this.getStockoutPredictions(sellerId);
        const agingInventory = await this.getAgingInventory(sellerId);
        const recommendations = [];
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
    async getTopSellingProducts(sellerId, limit = 10) {
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
        const productSales = products.map(product => {
            const totalSold = product._count.orderItems;
            return {
                ...product,
                totalSold,
            };
        });
        return productSales;
    }
};
exports.AnalyticsSellerService = AnalyticsSellerService;
exports.AnalyticsSellerService = AnalyticsSellerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsSellerService);
//# sourceMappingURL=analytics-seller.service.js.map