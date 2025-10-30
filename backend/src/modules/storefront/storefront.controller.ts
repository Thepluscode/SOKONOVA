import { Controller, Get, Param } from '@nestjs/common';
import { StorefrontService } from './storefront.service';

@Controller('storefront')
export class StorefrontController {
  constructor(private sf: StorefrontService) {}

  // PUBLIC
  // GET /storefront/handle/:handle
  @Get('handle/:handle')
  async getByHandle(@Param('handle') handle: string) {
    return this.sf.getStorefrontByHandle(handle);
  }
}
