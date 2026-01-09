import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('discovery')
export class DiscoveryController {
  constructor(private disc: DiscoveryService) {}

  // PUBLIC: main discovery landing sections
  // GET /discovery/highlights
  @Get('highlights')
  async highlights() {
    return this.disc.getDiscoveryHighlights();
  }

  // AUTHENTICATED: personalized discovery for logged-in users
  // GET /discovery/personalized
  @Get('personalized')
  @UseGuards(JwtAuthGuard)
  async personalized(@Query('userId') userId: string) {
    return this.disc.getPersonalizedDiscovery(userId);
  }

  // PUBLIC: category landing
  // GET /discovery/by-category/:slug
  @Get('by-category/:slug')
  async byCategory(@Param('slug') slug: string) {
    return this.disc.getCategoryPage(slug.toLowerCase());
  }

  // PUBLIC: region landing
  // GET /discovery/by-region/:regionSlug
  @Get('by-region/:regionSlug')
  async byRegion(@Param('regionSlug') regionSlug: string) {
    return this.disc.getRegionPage(regionSlug.toLowerCase());
  }
}