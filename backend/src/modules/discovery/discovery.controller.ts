import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('discovery')
export class DiscoveryController {
  constructor(private disc: DiscoveryService) { }

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
  async personalized(@CurrentUser('id') userId: string) {
    return this.disc.getPersonalizedDiscovery(userId);
  }

  // PUBLIC: search with paging + filters
  // GET /discovery/products-search?q=...&category=...&minPrice=...&maxPrice=...&rating=...&inStock=true&country=...&sellerId=...&sort=...&page=...&limit=...
  @Get('products-search')
  async search(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('rating') rating?: string,
    @Query('inStock') inStock?: string,
    @Query('country') country?: string,
    @Query('sellerId') sellerId?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.disc.searchProducts({
      q,
      category,
      minPrice,
      maxPrice,
      rating,
      inStock,
      country,
      sellerId,
      sort,
      page,
      limit,
    });
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
