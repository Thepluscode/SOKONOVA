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
var SmsAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsAdapter = void 0;
const common_1 = require("@nestjs/common");
const AfricasTalking = require("africastalking");
let SmsAdapter = SmsAdapter_1 = class SmsAdapter {
    constructor() {
        this.logger = new common_1.Logger(SmsAdapter_1.name);
        this.at = null;
        const apiKey = process.env.AFRICASTALKING_API_KEY;
        const username = process.env.AFRICASTALKING_USERNAME;
        this.enabled = !!(apiKey && username);
        this.shortCode = process.env.AFRICASTALKING_SHORT_CODE || 'SokoNova';
        if (this.enabled) {
            this.at = AfricasTalking({
                apiKey,
                username,
            });
            this.logger.log("Africa's Talking SMS adapter initialized");
        }
        else {
            this.logger.warn("Africa's Talking credentials not found. SMS notifications will be logged only.");
        }
    }
    async send(toPhone, message) {
        this.logger.log(`[SMS] to ${toPhone}: ${message.substring(0, 50)}...`);
        if (!this.enabled || !this.at) {
            this.logger.debug(`SMS body: ${message}`);
            return { sent: false, channel: 'sms' };
        }
        try {
            const formattedPhone = this.formatPhoneNumber(toPhone);
            const truncatedMessage = message.length > 160 ? message.substring(0, 157) + '...' : message;
            const result = await this.at.SMS.send({
                to: [formattedPhone],
                message: truncatedMessage,
                from: this.shortCode,
            });
            this.logger.log(`SMS sent successfully to ${toPhone}:`, result);
            return { sent: true, channel: 'sms' };
        }
        catch (error) {
            this.logger.error(`Failed to send SMS to ${toPhone}: ${error.message}`, error.stack);
            return { sent: false, channel: 'sms' };
        }
    }
    async sendWhatsApp(toPhone, message) {
        this.logger.log(`[WhatsApp] to ${toPhone}: ${message.substring(0, 50)}...`);
        this.logger.warn('WhatsApp integration not yet configured. Message logged only.');
        return { sent: false, channel: 'whatsapp' };
    }
    formatPhoneNumber(phone) {
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '234' + cleaned.substring(1);
        }
        if (!cleaned.startsWith('+')) {
            cleaned = '+' + cleaned;
        }
        return cleaned;
    }
};
exports.SmsAdapter = SmsAdapter;
exports.SmsAdapter = SmsAdapter = SmsAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SmsAdapter);
//# sourceMappingURL=sms.adapter.js.map