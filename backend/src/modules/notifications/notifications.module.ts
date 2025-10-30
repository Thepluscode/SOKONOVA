import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { EmailAdapter } from './providers/email.adapter';
import { SmsAdapter } from './providers/sms.adapter';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NotificationsService, EmailAdapter, SmsAdapter],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
