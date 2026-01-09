import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { TrustService } from './trust.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('trust')
export class TrustController {
  constructor(private readonly trustService: TrustService) {}

  // GET /trust/sellers/:sellerId/quality-score
  @Get('sellers/:sellerId/quality-score')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async getSellerQualityScore(@Param('sellerId') sellerId: string) {
    return this.trustService.getSellerQualityScore(sellerId);
  }

  // GET /trust/sellers/:sellerId/dispute-shield
  @Get('sellers/:sellerId/dispute-shield')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async getSellerDisputeShield(@Param('sellerId') sellerId: string) {
    return this.trustService.getSellerDisputeShield(sellerId);
  }

  // GET /trust/sellers/:sellerId/reputation-graph
  @Get('sellers/:sellerId/reputation-graph')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async getSellerReputationGraph(@Param('sellerId') sellerId: string) {
    return this.trustService.getSellerReputationGraph(sellerId);
  }

  // GET /trust/sellers/:sellerId/full-reputation-graph
  @Get('sellers/:sellerId/full-reputation-graph')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async getSellerFullReputationGraph(@Param('sellerId') sellerId: string) {
    return this.trustService.getSellerFullReputationGraph(sellerId);
  }

  // GET /trust/sellers/:sellerId/compliance
  @Get('sellers/:sellerId/compliance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async getSellerComplianceStatus(@Param('sellerId') sellerId: string) {
    return this.trustService.getSellerComplianceStatus(sellerId);
  }

  // POST /trust/sellers/:sellerId/kyc
  @Post('sellers/:sellerId/kyc')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async submitKYCDocuments(
    @Param('sellerId') sellerId: string,
    @Body() data: {
      documentType: string;
      documentNumber: string;
      documentUrl: string;
      country: string;
    },
  ) {
    return this.trustService.submitKYCDocuments(sellerId, data);
  }

  // POST /trust/sellers/:sellerId/tax-registration
  @Post('sellers/:sellerId/tax-registration')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async submitTaxRegistration(
    @Param('sellerId') sellerId: string,
    @Body() data: {
      taxId: string;
      country: string;
    },
  ) {
    return this.trustService.submitTaxRegistration(sellerId, data);
  }

  // GET /trust/products/:productId/counterfeit-scan
  @Get('products/:productId/counterfeit-scan')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getProductCounterfeitScan(@Param('productId') productId: string) {
    return this.trustService.getProductCounterfeitScan(productId);
  }

  // POST /trust/products/report-counterfeit
  @Post('products/report-counterfeit')
  @UseGuards(JwtAuthGuard)
  async reportCounterfeitProduct(
    @Body() data: {
      reporterId: string;
      productId: string;
      reason: string;
      evidenceUrl?: string;
    },
  ) {
    return this.trustService.reportCounterfeitProduct(data);
  }

  // GET /trust/admin/:adminId/dashboard
  @Get('admin/:adminId/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAdminTrustDashboard(@Param('adminId') adminId: string) {
    return this.trustService.getAdminTrustDashboard(adminId);
  }

  // GET /trust/sellers/:sellerId/risk-assessment
  @Get('sellers/:sellerId/risk-assessment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getSellerRiskAssessment(@Param('sellerId') sellerId: string) {
    return this.trustService.getSellerRiskAssessment(sellerId);
  }
}