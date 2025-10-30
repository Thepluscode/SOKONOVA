import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { OpenDisputeDto } from './dto/open-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';

@Controller('disputes')
export class DisputesController {
  constructor(private disputes: DisputesService) {}

  // BUYER: open a dispute
  @Post('open')
  async open(@Body() body: OpenDisputeDto) {
    // TODO: enforce body.buyerId === session.user.id
    return this.disputes.open(body);
  }

  // BUYER: list my disputes
  @Get('mine')
  async mine(@Query('buyerId') buyerId: string) {
    // TODO: enforce buyerId === session.user.id
    return this.disputes.listMine(buyerId);
  }

  // SELLER/ADMIN: see issue queue for this seller
  @Get('seller')
  async seller(@Query('sellerId') sellerId: string) {
    // TODO: enforce sellerId === session.user.id OR admin
    return this.disputes.listForSeller(sellerId);
  }

  // SELLER/ADMIN: resolve dispute
  @Patch(':id/resolve')
  async resolve(@Param('id') disputeId: string, @Body() body: ResolveDisputeDto) {
    return this.disputes.resolve(disputeId, body);
  }
}
