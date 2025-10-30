
import { Controller, Get, Param, Patch, Body } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.users.findById(id)
  }

  @Patch(':id/storefront')
  async updateStorefront(
    @Param('id') id: string,
    @Body()
    body: {
      shopName?: string;
      sellerHandle?: string;
      shopLogoUrl?: string;
      shopBannerUrl?: string;
      shopBio?: string;
      country?: string;
      city?: string;
    }
  ) {
    // TODO: auth: ensure :id === session.user.id OR admin
    return this.users.updateStorefrontProfile(id, body);
  }
}
