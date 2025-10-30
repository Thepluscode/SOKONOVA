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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const payments_service_1 = require("./payments.service");
const create_intent_dto_1 = require("./dto/create-intent.dto");
let PaymentsController = class PaymentsController {
    constructor(payments) {
        this.payments = payments;
    }
    async createIntent(dto) {
        return this.payments.createPaymentIntent({
            orderId: dto.orderId,
            provider: dto.provider,
        });
    }
    async webhookPaystack(req, res) {
        try {
            const signature = req.headers['x-paystack-signature'];
            if (!signature) {
                throw new common_1.UnauthorizedException('No signature provided');
            }
            const secret = process.env.PAYSTACK_SECRET_KEY;
            if (!secret) {
                throw new Error('PAYSTACK_SECRET_KEY not configured');
            }
            const hash = crypto
                .createHmac('sha512', secret)
                .update(JSON.stringify(req.body))
                .digest('hex');
            if (hash !== signature) {
                throw new common_1.UnauthorizedException('Invalid signature');
            }
            const { event, data } = req.body;
            if (event !== 'charge.success') {
                return res.send('ignored');
            }
            const externalRef = data.reference;
            const status = data.status;
            const metadata = data.metadata || {};
            const orderId = metadata.orderId;
            if (status === 'success') {
                await this.payments.markPaymentSuccessByRef(externalRef, orderId);
                return res.send('ok');
            }
            else {
                await this.payments.markPaymentFailedByRef(externalRef);
                return res.send('failed recorded');
            }
        }
        catch (error) {
            console.error('Paystack webhook error:', error);
            return res.status(400).send('webhook error');
        }
    }
    async webhookFlutterwave(req, res) {
        try {
            const signature = req.headers['verif-hash'];
            const secret = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
            if (!signature || !secret) {
                throw new common_1.UnauthorizedException('Invalid webhook signature');
            }
            if (signature !== secret) {
                throw new common_1.UnauthorizedException('Signature mismatch');
            }
            const { event, data } = req.body;
            if (event !== 'charge.completed') {
                return res.send('ignored');
            }
            const externalRef = data.tx_ref;
            const status = data.status;
            const metadata = data.meta || {};
            const orderId = metadata.orderId;
            if (status === 'successful') {
                await this.payments.markPaymentSuccessByRef(externalRef, orderId);
                return res.send('ok');
            }
            else {
                await this.payments.markPaymentFailedByRef(externalRef);
                return res.send('failed recorded');
            }
        }
        catch (error) {
            console.error('Flutterwave webhook error:', error);
            return res.status(400).send('webhook error');
        }
    }
    async webhookStripe(req, res) {
        var _a;
        try {
            const signature = req.headers['stripe-signature'];
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
            if (!signature || !webhookSecret) {
                throw new common_1.UnauthorizedException('Invalid webhook signature');
            }
            const payload = JSON.stringify(req.body);
            const expectedSignature = crypto
                .createHmac('sha256', webhookSecret)
                .update(payload)
                .digest('hex');
            const sigParts = signature.split(',');
            const v1Sig = (_a = sigParts.find((s) => s.startsWith('v1='))) === null || _a === void 0 ? void 0 : _a.substring(3);
            if (!v1Sig) {
                throw new common_1.UnauthorizedException('Invalid Stripe signature format');
            }
            const matches = crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(v1Sig));
            if (!matches) {
                throw new common_1.UnauthorizedException('Signature verification failed');
            }
            const { type, data } = req.body;
            if (type !== 'payment_intent.succeeded') {
                return res.send('ignored');
            }
            const paymentIntent = data.object;
            const externalRef = paymentIntent.id;
            const metadata = paymentIntent.metadata || {};
            const orderId = metadata.orderId;
            await this.payments.markPaymentSuccessByRef(externalRef, orderId);
            return res.send('ok');
        }
        catch (error) {
            console.error('Stripe webhook error:', error);
            return res.status(400).send('webhook error');
        }
    }
    async getPayment(orderId) {
        return this.payments.getPaymentByOrderId(orderId);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('intent'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_intent_dto_1.CreateIntentDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createIntent", null);
__decorate([
    (0, common_1.Post)('webhook/paystack'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "webhookPaystack", null);
__decorate([
    (0, common_1.Post)('webhook/flutterwave'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "webhookFlutterwave", null);
__decorate([
    (0, common_1.Post)('webhook/stripe'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "webhookStripe", null);
__decorate([
    (0, common_1.Get)(':orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPayment", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map