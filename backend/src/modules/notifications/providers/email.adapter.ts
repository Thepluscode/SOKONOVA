import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailAdapter {
  private readonly logger = new Logger(EmailAdapter.name);
  private readonly enabled: boolean;

  constructor() {
    // Initialize SendGrid if API key is available
    const apiKey = process.env.SENDGRID_API_KEY;
    this.enabled = !!apiKey;

    if (this.enabled) {
      sgMail.setApiKey(apiKey);
      this.logger.log('SendGrid email adapter initialized');
    } else {
      this.logger.warn(
        'SendGrid API key not found. Email notifications will be logged only.',
      );
    }
  }

  /**
   * Send email notification via SendGrid
   * Falls back to logging if SendGrid is not configured
   */
  async send(
    toEmail: string,
    subject: string,
    body: string,
    data?: any,
  ): Promise<{ sent: boolean; channel: string }> {
    this.logger.log(`[EMAIL] to ${toEmail}: ${subject}`);

    if (!this.enabled) {
      this.logger.debug(`Email body: ${body}`);
      return { sent: false, channel: 'email' };
    }

    try {
      const fromEmail =
        process.env.SENDGRID_FROM_EMAIL || 'notifications@sokonova.com';

      // Create HTML email with branding
      const html = this.createEmailHtml(subject, body, data);

      await sgMail.send({
        to: toEmail,
        from: {
          email: fromEmail,
          name: 'SokoNova',
        },
        subject,
        text: body, // Plain text fallback
        html,
      });

      this.logger.log(`Email sent successfully to ${toEmail}`);
      return { sent: true, channel: 'email' };
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${toEmail}: ${error.message}`,
        error.stack,
      );
      return { sent: false, channel: 'email' };
    }
  }

  /**
   * Create branded HTML email template
   */
  private createEmailHtml(
    subject: string,
    body: string,
    data?: any,
  ): string {
    const baseUrl = process.env.FRONTEND_BASE_URL || 'https://sokonova.com';
    const logoUrl = `${baseUrl}/sokonova-logo.svg`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .email-container {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 2px solid #f0f0f0;
    }
    .logo {
      width: 48px;
      height: 48px;
      margin-bottom: 12px;
    }
    .brand-name {
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }
    .tagline {
      font-size: 14px;
      color: #666;
      margin: 4px 0 0 0;
    }
    .content {
      margin-bottom: 32px;
    }
    .title {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 16px 0;
    }
    .body-text {
      font-size: 16px;
      color: #333;
      margin: 0 0 16px 0;
    }
    .cta-button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #3b82f6;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 16px;
    }
    .footer {
      text-align: center;
      padding-top: 24px;
      border-top: 2px solid #f0f0f0;
      font-size: 14px;
      color: #666;
    }
    .footer-links {
      margin-top: 12px;
    }
    .footer-link {
      color: #3b82f6;
      text-decoration: none;
      margin: 0 8px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="${logoUrl}" alt="SokoNova" class="logo" />
      <h1 class="brand-name">SokoNova</h1>
      <p class="tagline">Shop local. Shine global.</p>
    </div>

    <div class="content">
      <h2 class="title">${subject}</h2>
      <p class="body-text">${body}</p>
      ${data?.ctaUrl ? `<a href="${data.ctaUrl}" class="cta-button">${data.ctaText || 'View Details'}</a>` : ''}
    </div>

    <div class="footer">
      <p>This email was sent from SokoNova. If you have questions, please contact us.</p>
      <div class="footer-links">
        <a href="${baseUrl}" class="footer-link">Visit Website</a>
        <a href="${baseUrl}/account/notifications" class="footer-link">Manage Notifications</a>
        <a href="${baseUrl}/help" class="footer-link">Help Center</a>
      </div>
      <p style="margin-top: 16px; font-size: 12px;">
        &copy; ${new Date().getFullYear()} SokoNova. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }
}
