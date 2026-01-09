import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';

interface UserPayload {
    id: string;
    email: string;
    role: string;
}

@Controller('teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamsController {
    constructor(private teamsService: TeamsService) { }

    /**
     * POST /teams
     * Create a new team (Admin/Manager only)
     */
    @Post()
    @Roles(Role.ADMIN, Role.MANAGER)
    async create(
        @Body() body: { name: string; description?: string },
        @CurrentUser() user: UserPayload,
        @Req() req: Request,
    ) {
        return this.teamsService.create(
            { ...body, createdById: user.id },
            req.ip,
            req.headers['user-agent'],
        );
    }

    /**
     * GET /teams
     * List all teams (Admin/Manager only)
     */
    @Get()
    @Roles(Role.ADMIN, Role.MANAGER)
    async findAll(
        @Query('skip') skip = 0,
        @Query('take') take = 50,
    ) {
        return this.teamsService.findAll(Number(skip), Number(take));
    }

    /**
     * GET /teams/my
     * Get teams for the current user
     */
    @Get('my')
    async findMyTeams(@CurrentUser() user: UserPayload) {
        return this.teamsService.findByUser(user.id);
    }

    /**
     * GET /teams/:id
     * Get a team by ID (Admin/Manager only)
     */
    @Get(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    async findOne(@Param('id') id: string) {
        return this.teamsService.findOne(id);
    }

    /**
     * PUT /teams/:id
     * Update a team (Admin/Manager only)
     */
    @Put(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    async update(
        @Param('id') id: string,
        @Body() body: { name?: string; description?: string },
        @CurrentUser() user: UserPayload,
        @Req() req: Request,
    ) {
        return this.teamsService.update(
            id,
            body,
            user.id,
            req.ip,
            req.headers['user-agent'],
        );
    }

    /**
     * DELETE /teams/:id
     * Delete a team (Admin only)
     */
    @Delete(':id')
    @Roles(Role.ADMIN)
    async delete(
        @Param('id') id: string,
        @CurrentUser() user: UserPayload,
        @Req() req: Request,
    ) {
        return this.teamsService.delete(id, user.id, req.ip, req.headers['user-agent']);
    }

    /**
     * POST /teams/:id/members
     * Add a member to a team (Admin/Manager only)
     */
    @Post(':id/members')
    @Roles(Role.ADMIN, Role.MANAGER)
    async addMember(
        @Param('id') teamId: string,
        @Body() body: { userId: string; role?: string },
        @CurrentUser() user: UserPayload,
        @Req() req: Request,
    ) {
        return this.teamsService.addMember(
            teamId,
            { ...body, invitedBy: user.id },
            user.id,
            req.ip,
            req.headers['user-agent'],
        );
    }

    /**
     * DELETE /teams/:id/members/:userId
     * Remove a member from a team (Admin/Manager only)
     */
    @Delete(':id/members/:userId')
    @Roles(Role.ADMIN, Role.MANAGER)
    async removeMember(
        @Param('id') teamId: string,
        @Param('userId') userId: string,
        @CurrentUser() user: UserPayload,
        @Req() req: Request,
    ) {
        return this.teamsService.removeMember(
            teamId,
            userId,
            user.id,
            req.ip,
            req.headers['user-agent'],
        );
    }

    /**
     * PUT /teams/:id/members/:userId
     * Update a member's role (Admin/Manager only)
     */
    @Put(':id/members/:userId')
    @Roles(Role.ADMIN, Role.MANAGER)
    async updateMemberRole(
        @Param('id') teamId: string,
        @Param('userId') userId: string,
        @Body() body: { role: string },
        @CurrentUser() user: UserPayload,
        @Req() req: Request,
    ) {
        return this.teamsService.updateMemberRole(
            teamId,
            userId,
            body,
            user.id,
            req.ip,
            req.headers['user-agent'],
        );
    }
}
