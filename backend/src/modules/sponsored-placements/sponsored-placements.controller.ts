import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { SponsoredPlacementsService } from './sponsored-placements.service';

@Controller('sponsored-placements')
export class SponsoredPlacementsController {
  constructor(private readonly sponsoredPlacementsService: SponsoredPlacementsService) {}

  // POST /sponsored-placements
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async createSponsoredPlacement(
    @Body() data: {
      sellerId: string;
      productId: string;
      categorySlug?: string;
      searchTerm?: string;
      bidAmount: number;
      startDate: Date;
      endDate: Date;
    },
  ) {
    return this.sponsoredPlacementsService.createSponsoredPlacement(data);
  }

  // GET /sponsored-placements/seller/:sellerId
  @Get('seller/:sellerId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async getSellerSponsoredPlacements(@Param('sellerId') sellerId: string) {
    return this.sponsoredPlacementsService.getSellerSponsoredPlacements(sellerId);
  }

  // PUT /sponsored-placements/:id
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async updateSponsoredPlacement(
    @Param('id') id: string,
    @Body() data: { bidAmount?: number; startDate?: Date; endDate?: Date },
  ) {
    return this.sponsoredPlacementsService.updateSponsoredPlacement(id, data);
  }

  // DELETE /sponsored-placements/:id
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async deleteSponsoredPlacement(@Param('id') id: string) {
    return this.sponsoredPlacementsService.deleteSponsoredPlacement(id);
  }

  // GET /sponsored-placements/search
  @Get('search')
  async getSponsoredPlacementsForSearch(@Query('term') term: string) {
    return this.sponsoredPlacementsService.getSponsoredPlacementsForSearch(term);
  }

  // GET /sponsored-placements/category/:slug
  @Get('category/:slug')
  async getSponsoredPlacementsForCategory(@Param('slug') slug: string) {
    return this.sponsoredPlacementsService.getSponsoredPlacementsForCategory(slug);
  }

  // GET /sponsored-placements/admin/all
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllSponsoredPlacements() {
    return this.sponsoredPlacementsService.getAllSponsoredPlacements();
  }

  // PUT /sponsored-placements/:id/status
  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateSponsoredPlacementStatus(
    @Param('id') id: string,
    @Body() data: { status: string },
  ) {
    return this.sponsoredPlacementsService.updateSponsoredPlacementStatus(id, data.status as any);
  }
}