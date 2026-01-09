import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SellerApplicationsService } from './seller-applications.service';
import { ApplyDto } from './dto/apply.dto';
import { ModerateDto } from './dto/moderate.dto';

@Controller('seller-applications')
export class SellerApplicationsController {
  constructor(private svc: SellerApplicationsService) {}

  // BUYER: submit or resubmit application
  // POST /seller-applications/apply
  @Post('apply')
  async apply(@Body() body: ApplyDto) {
    // TODO: require body.userId === session.user.id
    return this.svc.apply(body);
  }

  // INSTANT ACTIVATION (MVP Mode)
  // POST /seller-applications/activate-instant
  // Auto-approves seller immediately for quick onboarding
  @Post('activate-instant')
  async activateInstant(@Body() body: ApplyDto) {
    // TODO: require body.userId === session.user.id
    return this.svc.applyAndActivateInstantly(body);
  }

  // BUYER: check my status
  // GET /seller-applications/mine?userId=abc
  @Get('mine')
  async mine(@Query('userId') userId: string) {
    // TODO: enforce self-access only
    return this.svc.getMine(userId);
  }

  // ADMIN: list pending apps
  // GET /seller-applications/pending?adminId=ADMIN_USER_ID
  @Get('pending')
  async pending(@Query('adminId') adminId: string) {
    return this.svc.listPending(adminId);
  }

  // ADMIN: approve
  // PATCH /seller-applications/:id/approve
  @Patch(':id/approve')
  async approve(@Param('id') appId: string, @Body() body: ModerateDto) {
    return this.svc.approve(appId, body);
  }

  // ADMIN: reject
  // PATCH /seller-applications/:id/reject
  @Patch(':id/reject')
  async reject(@Param('id') appId: string, @Body() body: ModerateDto) {
    return this.svc.reject(appId, body);
  }
}
