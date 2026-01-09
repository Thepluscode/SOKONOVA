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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const email_adapter_1 = require("./providers/email.adapter");
const sms_adapter_1 = require("./providers/sms.adapter");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(prisma, email, sms) {
        this.prisma = prisma;
        this.email = email;
        this.sms = sms;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async create(userId, type, title, body, data, channels = ['inapp']) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    email: true,
                    phone: true,
                    timezone: true,
                    notifyEmail: true,
                    notifySms: true,
                    notifyPush: true,
                    quietHoursStart: true,
                    quietHoursEnd: true,
                },
            });
            if (!user) {
                this.logger.warn(`User ${userId} not found for notification`);
                return null;
            }
            const notification = await this.prisma.notification.create({
                data: {
                    userId,
                    type,
                    title,
                    body,
                    message: body,
                },
            });
            this.logger.log(`Created notification ${notification.id} for user ${userId}: ${title}`);
            const inQuietHours = this.isInQuietHours(user.timezone || 'Africa/Lagos', user.quietHoursStart, user.quietHoursEnd);
            const promises = [];
            if (channels.includes('email') &&
                user.notifyEmail &&
                user.email &&
                !inQuietHours) {
                promises.push(this.sendWithTimeout(this.email.send(user.email, title, body, data), 5000));
            }
            if (channels.includes('sms') &&
                user.notifySms &&
                user.phone &&
                !inQuietHours) {
                promises.push(this.sendWithTimeout(this.sms.send(user.phone, body), 5000));
            }
            if (channels.includes('whatsapp') &&
                user.notifySms &&
                user.phone &&
                !inQuietHours) {
                promises.push(this.sendWithTimeout(this.sms.sendWhatsApp(user.phone, body), 5000));
            }
            if (promises.length > 0) {
                try {
                    await Promise.all(promises);
                }
                catch (error) {
                    this.logger.error(`Failed to send one or more external notifications: ${error.message}`, error.stack);
                    throw new Error(`Notification delivery failed: ${error.message}`);
                }
            }
            return notification;
        }
        catch (error) {
            this.logger.error(`Failed to create notification: ${error.message}`, error.stack);
            throw error;
        }
    }
    async sendWithTimeout(promise, timeoutMs) {
        return Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Notification send timeout')), timeoutMs)),
        ]);
    }
    async list(userId, limit = 20, unreadOnly = false) {
        return this.prisma.notification.findMany({
            where: {
                userId,
                ...(unreadOnly ? { readAt: null } : {}),
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: {
                userId,
                readAt: null,
            },
        });
    }
    async markRead(userId, notificationId) {
        return this.prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId,
            },
            data: {
                readAt: new Date(),
            },
        });
    }
    async markAllRead(userId) {
        return this.prisma.notification.updateMany({
            where: {
                userId,
                readAt: null,
            },
            data: {
                readAt: new Date(),
            },
        });
    }
    async delete(userId, notificationId) {
        return this.prisma.notification.deleteMany({
            where: {
                id: notificationId,
                userId,
            },
        });
    }
    async notifyOrderPaid(buyerId, orderId, orderTotal, currency) {
        return this.create(buyerId, 'ORDER_PAID', 'Payment Received', `Your payment of ${currency} ${orderTotal.toFixed(2)} was successful. Order #${orderId} is now being prepared.`, { orderId }, ['inapp', 'email']);
    }
    async notifySellerNewOrder(sellerId, orderId, orderItemId, productTitle, quantity) {
        return this.create(sellerId, 'ORDER_PAID', 'New Paid Order', `You have a new order: ${productTitle} x${quantity}. Please prepare for shipment.`, { orderId, orderItemId }, ['inapp', 'email']);
    }
    async notifyShipmentUpdate(buyerId, orderItemId, status, trackingCode, carrier) {
        const statusMessages = {
            SHIPPED: `Your order has been shipped${trackingCode ? ` via ${carrier} (${trackingCode})` : ''}.`,
            OUT_FOR_DELIVERY: 'Your order is out for delivery and will arrive soon!',
            DELIVERED: 'Your order has been delivered. Enjoy!',
        };
        const type = status === 'DELIVERED'
            ? 'ORDER_DELIVERED'
            : status === 'OUT_FOR_DELIVERY'
                ? 'ORDER_OUT_FOR_DELIVERY'
                : 'ORDER_SHIPPED';
        return this.create(buyerId, type, `Order ${status === 'DELIVERED' ? 'Delivered' : status === 'OUT_FOR_DELIVERY' ? 'Out for Delivery' : 'Shipped'}`, statusMessages[status], { orderItemId, trackingCode, carrier }, status === 'DELIVERED' ? ['inapp', 'email'] : ['inapp', 'sms']);
    }
    async notifyDisputeOpened(sellerId, disputeId, orderItemId, productTitle, reason) {
        return this.create(sellerId, 'DISPUTE_OPENED', 'New Dispute', `A buyer opened a dispute on "${productTitle}" (Reason: ${reason}). Please respond within 48 hours.`, { disputeId, orderItemId }, ['inapp', 'email']);
    }
    async notifyDisputeResolved(buyerId, disputeId, resolution, resolutionNote) {
        return this.create(buyerId, 'DISPUTE_RESOLVED', 'Dispute Resolved', `Your dispute has been resolved: ${resolution}. ${resolutionNote || ''}`, { disputeId }, ['inapp', 'email']);
    }
    async notifyPayoutReleased(sellerId, amount, currency, batchId, itemCount) {
        return this.create(sellerId, 'PAYOUT_RELEASED', 'Payout Released', `Your payout of ${currency} ${amount.toFixed(2)} for ${itemCount} orders has been processed and sent.`, { batchId, amount, currency }, ['inapp', 'email']);
    }
    async notifyAdminRiskAlert(adminId, alertType, message, data) {
        return this.create(adminId, 'RISK_ALERT', `Risk Alert: ${alertType}`, message, data, ['inapp', 'email']);
    }
    async notifyNewReview(sellerId, reviewId, productTitle, rating, buyerName) {
        return this.create(sellerId, 'NEW_REVIEW', 'New Review', `${buyerName} left a ${rating}★ review on "${productTitle}".`, { reviewId }, ['inapp']);
    }
    async notifyException(buyerId, orderItemId, priority, message) {
        const priorityLabels = {
            high_priority: 'High Priority',
            medium_priority: 'Medium Priority',
            low_priority: 'Low Priority',
        };
        return this.create(buyerId, 'EXCEPTION_ALERT', `Order Exception - ${priorityLabels[priority]}`, message, { orderItemId, priority }, ['inapp', 'email']);
    }
    async notifySellerException(sellerId, orderItemId, actionRequired, message) {
        const actionLabels = {
            urgent_action_required: 'Urgent Action Required',
            attention_required: 'Attention Required',
            review_required: 'Review Required',
        };
        return this.create(sellerId, 'SELLER_EXCEPTION', `Fulfillment Exception - ${actionLabels[actionRequired]}`, message, { orderItemId, actionRequired }, ['inapp', 'email']);
    }
    async notifyMicroFulfillmentOptIn(sellerId, partnerId, message) {
        return this.create(sellerId, 'MICRO_FULFILLMENT_OPT_IN', 'Micro-Fulfillment Service Activated', message, { partnerId }, ['inapp', 'email']);
    }
    isInQuietHours(timezone, quietHoursStart, quietHoursEnd) {
        if (quietHoursStart === null || quietHoursEnd === null) {
            return false;
        }
        try {
            const now = new Date();
            const hourLocal = parseInt(now.toLocaleString('en-US', {
                hour: '2-digit',
                hour12: false,
                timeZone: timezone,
            }), 10);
            if (quietHoursStart <= quietHoursEnd) {
                return hourLocal >= quietHoursStart && hourLocal < quietHoursEnd;
            }
            else {
                return hourLocal >= quietHoursStart || hourLocal < quietHoursEnd;
            }
        }
        catch (error) {
            this.logger.error(`Failed to check quiet hours: ${error.message}`, error.stack);
            return false;
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_adapter_1.EmailAdapter,
        sms_adapter_1.SmsAdapter])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map