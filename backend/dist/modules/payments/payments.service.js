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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    async initPaystack(order, customerEmail) {
        const amountMinorUnits = Math.round(Number(order.total) * 100);
        const currency = order.currency || 'NGN';
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amountMinorUnits,
                currency,
                email: customerEmail,
                metadata: {
                    orderId: order.id,
                },
                callback_url: `${process.env.FRONTEND_BASE_URL}/checkout/verify?orderId=${order.id}`,
            }),
        });
        const json = await response.json();
        if (!json.status) {
            throw new common_1.InternalServerErrorException('Paystack initialization failed');
        }
        return {
            externalRef: json.data.reference,
            checkoutUrl: json.data.authorization_url,
        };
    }
    async initFlutterwave(order, customerEmail, customerName) {
        const amount = Number(order.total);
        const currency = order.currency || 'USD';
        const response = await fetch('https://api.flutterwave.com/v3/payments', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tx_ref: `tx_${order.id}_${Date.now()}`,
                amount,
                currency,
                redirect_url: `${process.env.FRONTEND_BASE_URL}/checkout/verify?orderId=${order.id}`,
                customer: {
                    email: customerEmail,
                    name: customerName,
                },
                customizations: {
                    title: 'SokoNova Order',
                    description: `Order ${order.id}`,
                    logo: `${process.env.FRONTEND_BASE_URL}/logo.png`,
                },
                meta: {
                    orderId: order.id,
                },
            }),
        });
        const json = await response.json();
        if (json.status !== 'success') {
            throw new common_1.InternalServerErrorException('Flutterwave initialization failed');
        }
        return {
            externalRef: json.data.tx_ref,
            checkoutUrl: json.data.link,
        };
    }
    async initStripe(order, customerEmail) {
        var _a;
        const amountMinorUnits = Math.round(Number(order.total) * 100);
        const currency = ((_a = order.currency) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || 'usd';
        const response = await fetch('https://api.stripe.com/v1/payment_intents', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                amount: amountMinorUnits.toString(),
                currency,
                'metadata[orderId]': order.id,
                receipt_email: customerEmail,
            }).toString(),
        });
        const json = await response.json();
        if (json.error) {
            throw new common_1.InternalServerErrorException('Stripe initialization failed');
        }
        return {
            externalRef: json.id,
            clientSecret: json.client_secret,
            checkoutUrl: null,
        };
    }
    async createPaymentIntent({ orderId, provider }) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const customerEmail = order.user.email || 'buyer@sokonova.com';
        const customerName = order.user.name || 'SokoNova Buyer';
        let externalRef;
        let checkoutUrl = null;
        let clientSecret = null;
        if (provider === 'paystack') {
            const result = await this.initPaystack(order, customerEmail);
            externalRef = result.externalRef;
            checkoutUrl = result.checkoutUrl;
        }
        else if (provider === 'flutterwave') {
            const result = await this.initFlutterwave(order, customerEmail, customerName);
            externalRef = result.externalRef;
            checkoutUrl = result.checkoutUrl;
        }
        else if (provider === 'stripe') {
            const result = await this.initStripe(order, customerEmail);
            externalRef = result.externalRef;
            clientSecret = result.clientSecret;
            checkoutUrl = result.checkoutUrl;
        }
        else {
            throw new common_1.InternalServerErrorException('Unsupported payment provider');
        }
        const payment = await this.prisma.payment.upsert({
            where: { orderId: orderId },
            update: {
                provider,
                externalRef,
                amount: order.total,
                currency: order.currency,
                status: 'INITIATED',
                updatedAt: new Date(),
            },
            create: {
                orderId: orderId,
                provider,
                externalRef,
                amount: order.total,
                currency: order.currency,
            },
        });
        await this.prisma.order.update({
            where: { id: orderId },
            data: {
                paymentRef: externalRef,
            },
        });
        return {
            orderId,
            provider,
            externalRef: payment.externalRef,
            status: payment.status,
            amount: payment.amount.toString(),
            currency: payment.currency,
            checkoutUrl,
            clientSecret,
        };
    }
    async markPaymentSuccess(externalRef) {
        const payment = await this.prisma.payment.findFirst({
            where: { externalRef },
            include: { order: true },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.status === 'SUCCEEDED') {
            return payment;
        }
        const updatedPayment = await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: 'SUCCEEDED',
            },
        });
        const order = await this.prisma.order.update({
            where: { id: payment.orderId },
            data: {
                status: 'PAID',
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                title: true,
                            },
                        },
                    },
                },
            },
        });
        try {
            await this.notifications.notifyOrderPaid(order.userId, order.id, Number(order.total), order.currency);
            for (const item of order.items) {
                await this.notifications.notifySellerNewOrder(item.sellerId, order.id, item.id, item.product.title, item.qty);
            }
        }
        catch (error) {
            this.logger.error(`Failed to send payment notifications: ${error.message}`);
        }
        return updatedPayment;
    }
    async markPaymentFailed(externalRef) {
        const payment = await this.prisma.payment.findFirst({
            where: { externalRef },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.status === 'FAILED') {
            return payment;
        }
        const updatedPayment = await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: 'FAILED',
            },
        });
        await this.prisma.order.update({
            where: { id: payment.orderId },
            data: {
                status: 'CANCELLED',
            },
        });
        return updatedPayment;
    }
    async markPaymentSuccessByRef(externalRef, orderId) {
        const payment = await this.prisma.payment.findFirst({
            where: { externalRef },
            include: { order: true },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment not found for reference: ${externalRef}`);
        }
        if (orderId && payment.orderId !== orderId) {
            throw new common_1.BadRequestException(`OrderId mismatch: expected ${payment.orderId}, got ${orderId}`);
        }
        if (payment.status === 'SUCCEEDED') {
            return payment;
        }
        const updatedPayment = await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: 'SUCCEEDED',
            },
        });
        const order = await this.prisma.order.update({
            where: { id: payment.orderId },
            data: {
                status: 'PAID',
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                title: true,
                            },
                        },
                    },
                },
            },
        });
        try {
            await this.notifications.notifyOrderPaid(order.userId, order.id, Number(order.total), order.currency);
            for (const item of order.items) {
                await this.notifications.notifySellerNewOrder(item.sellerId, order.id, item.id, item.product.title, item.qty);
            }
        }
        catch (error) {
            this.logger.error(`Failed to send payment notifications: ${error.message}`);
        }
        return updatedPayment;
    }
    async markPaymentFailedByRef(externalRef) {
        const payment = await this.prisma.payment.findFirst({
            where: { externalRef },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment not found for reference: ${externalRef}`);
        }
        if (payment.status === 'FAILED') {
            return payment;
        }
        const updatedPayment = await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: 'FAILED',
            },
        });
        await this.prisma.order.update({
            where: { id: payment.orderId },
            data: {
                status: 'CANCELLED',
            },
        });
        return updatedPayment;
    }
    async getPaymentByOrderId(orderId) {
        return this.prisma.payment.findUnique({
            where: { orderId },
            include: {
                order: {
                    select: {
                        id: true,
                        status: true,
                        total: true,
                        currency: true,
                        createdAt: true,
                    },
                },
            },
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map