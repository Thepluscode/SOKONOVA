import { Injectable, Logger } from '@nestjs/common';
import * as AfricasTalking from 'africastalking';

interface AfricasTalkingService {
  SMS: {
    send(options: {
      to: string[];
      message: string;
      from?: string;
    }): Promise<any>;
  };
}

@Injectable()
export class SmsAdapter {
  private readonly logger = new Logger(SmsAdapter.name);
  private readonly enabled: boolean;
  private readonly at: AfricasTalkingService | null = null;
  private readonly shortCode: string;

  constructor() {
    // Initialize Africa's Talking if credentials are available
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
    } else {
      this.logger.warn(
        "Africa's Talking credentials not found. SMS notifications will be logged only.",
      );
    }
  }

  /**
   * Send SMS notification via Africa's Talking
   * Falls back to logging if not configured
   */
  async send(
    toPhone: string,
    message: string,
  ): Promise<{ sent: boolean; channel: string }> {
    this.logger.log(`[SMS] to ${toPhone}: ${message.substring(0, 50)}...`);

    if (!this.enabled || !this.at) {
      this.logger.debug(`SMS body: ${message}`);
      return { sent: false, channel: 'sms' };
    }

    try {
      // Format phone number (Africa's Talking expects international format)
      const formattedPhone = this.formatPhoneNumber(toPhone);

      // Truncate message to 160 characters (SMS limit)
      const truncatedMessage =
        message.length > 160 ? message.substring(0, 157) + '...' : message;

      const result = await this.at.SMS.send({
        to: [formattedPhone],
        message: truncatedMessage,
        from: this.shortCode,
      });

      this.logger.log(`SMS sent successfully to ${toPhone}:`, result);
      return { sent: true, channel: 'sms' };
    } catch (error) {
      this.logger.error(
        `Failed to send SMS to ${toPhone}: ${error.message}`,
        error.stack,
      );
      return { sent: false, channel: 'sms' };
    }
  }

  /**
   * Send WhatsApp message
   * Currently logs only - WhatsApp Business API requires additional setup
   */
  async sendWhatsApp(
    toPhone: string,
    message: string,
  ): Promise<{ sent: boolean; channel: string }> {
    // WhatsApp Business API requires:
    // 1. Approved WhatsApp Business account
    // 2. Message templates approved by Meta
    // 3. Additional API setup
    //
    // For production, integrate with:
    // - Twilio WhatsApp API
    // - Meta WhatsApp Business API (direct)
    // - Africa's Talking WhatsApp (when available)

    this.logger.log(
      `[WhatsApp] to ${toPhone}: ${message.substring(0, 50)}...`,
    );
    this.logger.warn(
      'WhatsApp integration not yet configured. Message logged only.',
    );

    return { sent: false, channel: 'whatsapp' };
  }

  /**
   * Format phone number to international format
   * Handles common African phone number formats
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // If starts with 0, assume it's a local number and add country code
    // This is a simple heuristic - in production, store country code with phone number
    if (cleaned.startsWith('0')) {
      // Default to Nigeria (+234) - adjust based on your primary market
      cleaned = '234' + cleaned.substring(1);
    }

    // Ensure it starts with +
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }

    return cleaned;
  }
}
