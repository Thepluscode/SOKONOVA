import {
    Controller,
    Get,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditLogsController {
    constructor(private auditLogsService: AuditLogsService) { }

    /**
     * GET /audit-logs
     * List audit logs with filtering (Admin/Manager only)
     */
    @Get()
    @Roles(Role.ADMIN, Role.MANAGER)
    async findAll(
        @Query('userId') userId?: string,
        @Query('action') action?: string,
        @Query('entityType') entityType?: string,
        @Query('entityId') entityId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('skip') skip = 0,
        @Query('take') take = 50,
    ) {
        return this.auditLogsService.findAll({
            userId,
            action,
            entityType,
            entityId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            skip: Number(skip),
            take: Number(take),
        });
    }

    /**
     * GET /audit-logs/summary
     * Get activity summary (Admin/Manager only)
     */
    @Get('summary')
    @Roles(Role.ADMIN, Role.MANAGER)
    async getSummary(@Query('days') days = 7) {
        return this.auditLogsService.getActivitySummary(Number(days));
    }

    /**
     * GET /audit-logs/:id
     * Get single audit log entry (Admin/Manager only)
     */
    @Get(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    async findOne(@Param('id') id: string) {
        return this.auditLogsService.findOne(id);
    }

    /**
     * GET /audit-logs/user/:userId
     * Get logs by user (Admin/Manager only)
     */
    @Get('user/:userId')
    @Roles(Role.ADMIN, Role.MANAGER)
    async findByUser(
        @Param('userId') userId: string,
        @Query('skip') skip = 0,
        @Query('take') take = 50,
    ) {
        return this.auditLogsService.findByUser(userId, Number(skip), Number(take));
    }

    /**
     * GET /audit-logs/entity/:type/:id
     * Get logs by entity (Admin/Manager only)
     */
    @Get('entity/:type/:entityId')
    @Roles(Role.ADMIN, Role.MANAGER)
    async findByEntity(
        @Param('type') entityType: string,
        @Param('entityId') entityId: string,
        @Query('skip') skip = 0,
        @Query('take') take = 50,
    ) {
        return this.auditLogsService.findByEntity(
            entityType,
            entityId,
            Number(skip),
            Number(take),
        );
    }

    /**
     * GET /audit-logs/action/:action
     * Get logs by action type (Admin/Manager only)
     */
    @Get('action/:action')
    @Roles(Role.ADMIN, Role.MANAGER)
    async findByAction(
        @Param('action') action: string,
        @Query('skip') skip = 0,
        @Query('take') take = 50,
    ) {
        return this.auditLogsService.findByAction(action, Number(skip), Number(take));
    }
}
