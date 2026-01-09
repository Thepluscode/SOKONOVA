import { Controller, Get, Post, Param, Body, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { SocialService } from './social.service';

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  // GET /social/stories/community
  @Get('stories/community')
  @UseGuards(JwtAuthGuard)
  async getCommunityStories(@Query('limit') limit?: string) {
    return this.socialService.getCommunityStories(limit ? parseInt(limit) : 10);
  }

  // POST /social/stories
  @Post('stories')
  @UseGuards(JwtAuthGuard)
  async createCommunityStory(
    @Body() data: {
      userId: string;
      productId: string;
      content: string;
      imageUrl?: string;
    },
  ) {
    return this.socialService.createCommunityStory(data);
  }

  // GET /social/influencers/storefronts
  @Get('influencers/storefronts')
  @UseGuards(JwtAuthGuard)
  async getInfluencerStorefronts(@Query('limit') limit?: string) {
    return this.socialService.getInfluencerStorefronts(limit ? parseInt(limit) : 10);
  }

  // GET /social/influencers/:handle/storefront
  @Get('influencers/:handle/storefront')
  @UseGuards(JwtAuthGuard)
  async getInfluencerStorefront(@Param('handle') handle: string) {
    return this.socialService.getInfluencerStorefront(handle);
  }
}