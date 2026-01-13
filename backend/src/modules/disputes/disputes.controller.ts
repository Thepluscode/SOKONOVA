import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { DisputesService } from './disputes.service';
import { OpenDisputeDto } from './dto/open-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('disputes')
export class DisputesController {
  constructor(private disputes: DisputesService) {}

  // BUYER: open a dispute
  @Post('open')
  @UseGuards(JwtAuthGuard)
  async open(
    @Body() body: OpenDisputeDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.disputes.open({ ...body, buyerId: user.id });
  }

  // BUYER: list my disputes
  @Get('mine')
  @UseGuards(JwtAuthGuard)
  async mine(@CurrentUser() user: { id: string }) {
    return this.disputes.listMine(user.id);
  }

  // SELLER/ADMIN: see issue queue for this seller
  @Get('seller')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async seller(
    @Query('sellerId') sellerId: string | undefined,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    if (sellerId && sellerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Not allowed to access other sellers');
    }
    return this.disputes.listForSeller(
      user.role === Role.ADMIN && sellerId ? sellerId : user.id,
    );
  }

  // SELLER/ADMIN: resolve dispute
  @Patch(':id/resolve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async resolve(
    @Param('id') disputeId: string,
    @Body() body: ResolveDisputeDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.disputes.resolve(disputeId, { ...body, actorId: user.id });
  }

  // ADMIN: list all disputes
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async admin() {
    return this.disputes.listAll();
  }
}
