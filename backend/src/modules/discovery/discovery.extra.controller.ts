import { Controller, Get, Query } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';

@Controller()
export class DiscoveryExtraController {
  constructor(private disc: DiscoveryService) {}

  // Absolute path fallbacks to ensure routes resolve
  @Get('discovery/social-proof')
  async socialProof(@Query('limit') limit?: string) {
    const parsed = limit ? parseInt(limit, 10) : 6;
    return this.disc.getSocialProof(Number.isNaN(parsed) ? 6 : parsed);
  }

  @Get('discovery/suggestions')
  async suggestions(@Query('q') q?: string) {
    if (!q || q.length < 2) {
      return { products: [], categories: [], sellers: [] };
    }
    return this.disc.getSuggestions(q);
  }
}
