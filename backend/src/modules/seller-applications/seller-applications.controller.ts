import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { SellerApplicationsService } from './seller-applications.service';
import { ApplyDto } from './dto/apply.dto';
import { ModerateDto } from './dto/moderate.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('seller-applications')
export class SellerApplicationsController {
  constructor(private svc: SellerApplicationsService) {}

  // BUYER: submit or resubmit application
  // POST /seller-applications/apply
  @Post('apply')
  @UseGuards(JwtAuthGuard)
  async apply(@Body() body: ApplyDto, @CurrentUser() user: { id: string }) {
    return this.svc.apply({ ...body, userId: user.id });
  }

  // INSTANT ACTIVATION (MVP Mode)
  // POST /seller-applications/activate-instant
  // Auto-approves seller immediately for quick onboarding
  @Post('activate-instant')
  @UseGuards(JwtAuthGuard)
  async activateInstant(@Body() body: ApplyDto, @CurrentUser() user: { id: string }) {
    return this.svc.applyAndActivateInstantly({ ...body, userId: user.id });
  }

  // BUYER: check my status
  // GET /seller-applications/mine?userId=abc
  @Get('mine')
  @UseGuards(JwtAuthGuard)
  async mine(@CurrentUser() user: { id: string }) {
    return this.svc.getMine(user.id);
  }

  // ADMIN: list pending apps
  // GET /seller-applications/pending?adminId=ADMIN_USER_ID
  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async pending(@CurrentUser() user: { id: string }) {
    return this.svc.listPending(user.id);
  }

  // ADMIN: list approved apps
  // GET /seller-applications/approved
  @Get('approved')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async approved(@CurrentUser() user: { id: string }) {
    return this.svc.listByStatus(user.id, 'APPROVED');
  }

  // ADMIN: list rejected apps
  // GET /seller-applications/rejected
  @Get('rejected')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async rejected(@CurrentUser() user: { id: string }) {
    return this.svc.listByStatus(user.id, 'REJECTED');
  }

  // ADMIN: approve
  // PATCH /seller-applications/:id/approve
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async approve(
    @Param('id') appId: string,
    @Body() body: ModerateDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.svc.approve(appId, { ...body, adminId: user.id });
  }

  // ADMIN: reject
  // PATCH /seller-applications/:id/reject
  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async reject(
    @Param('id') appId: string,
    @Body() body: ModerateDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.svc.reject(appId, { ...body, adminId: user.id });
  }
}
