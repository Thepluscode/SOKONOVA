import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { EmailAdapter } from './providers/email.adapter';
import { SmsAdapter } from './providers/sms.adapter';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NotificationsService, NotificationsGateway, EmailAdapter, SmsAdapter],
  controllers: [NotificationsController],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule { }
