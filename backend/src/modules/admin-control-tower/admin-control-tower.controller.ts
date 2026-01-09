import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminControlTowerService } from './admin-control-tower.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

@Controller('admin-control-tower')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class AdminControlTowerController {
  constructor(private adminControlTowerService: AdminControlTowerService) { }

  // ADMIN/MANAGER: get system health overview
  // GET /admin-control-tower/health
  @Get('health')
  async getSystemHealth(@CurrentUser() user: UserPayload) {
    return this.adminControlTowerService.getSystemHealth(user.id);
  }

  // ADMIN/MANAGER: get platform metrics
  // GET /admin-control-tower/metrics
  @Get('metrics')
  async getPlatformMetrics(@CurrentUser() user: UserPayload) {
    return this.adminControlTowerService.getPlatformMetrics(user.id);
  }

  // ADMIN/MANAGER: get recent activities
  // GET /admin-control-tower/activities
  @Get('activities')
  async getRecentActivities(@CurrentUser() user: UserPayload) {
    return this.adminControlTowerService.getRecentActivities(user.id);
  }

  // ADMIN/MANAGER: get system alerts
  // GET /admin-control-tower/alerts
  @Get('alerts')
  async getSystemAlerts(@CurrentUser() user: UserPayload) {
    return this.adminControlTowerService.getSystemAlerts(user.id);
  }

  // ADMIN/MANAGER: get user insights
  // GET /admin-control-tower/user-insights
  @Get('user-insights')
  async getUserInsights(@CurrentUser() user: UserPayload) {
    return this.adminControlTowerService.getUserInsights(user.id);
  }
}