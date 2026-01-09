import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ImpactInclusionService } from './impact-inclusion.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('impact-inclusion')
export class ImpactInclusionController {
  constructor(private impactInclusionService: ImpactInclusionService) {}

  // ADMIN: get impact metrics
  // GET /impact-inclusion/metrics?adminId=abc
  @Get('metrics')
  @UseGuards(JwtAuthGuard)
  async getImpactMetrics(@Query('adminId') adminId: string) {
    return this.impactInclusionService.getImpactMetrics(adminId);
  }

  // ADMIN: get diversity metrics
  // GET /impact-inclusion/diversity?adminId=abc
  @Get('diversity')
  @UseGuards(JwtAuthGuard)
  async getDiversityMetrics(@Query('adminId') adminId: string) {
    return this.impactInclusionService.getDiversityMetrics(adminId);
  }

  // ADMIN: get sustainability metrics
  // GET /impact-inclusion/sustainability?adminId=abc
  @Get('sustainability')
  @UseGuards(JwtAuthGuard)
  async getSustainabilityMetrics(@Query('adminId') adminId: string) {
    return this.impactInclusionService.getSustainabilityMetrics(adminId);
  }

  // ADMIN: get community impact
  // GET /impact-inclusion/community?adminId=abc
  @Get('community')
  @UseGuards(JwtAuthGuard)
  async getCommunityImpact(@Query('adminId') adminId: string) {
    return this.impactInclusionService.getCommunityImpact(adminId);
  }
}