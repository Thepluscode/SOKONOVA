import { Controller, Get, Param } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';

@Controller('discovery')
export class DiscoveryController {
  constructor(private disc: DiscoveryService) {}

  // PUBLIC: main discovery landing sections
  // GET /discovery/highlights
  @Get('highlights')
  async highlights() {
    return this.disc.getHighlights();
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
