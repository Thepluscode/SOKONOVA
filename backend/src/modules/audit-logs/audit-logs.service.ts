import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface CreateAuditLogDto {
    userId: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}

export interface AuditLogQuery {
    userId?: string;
    action?: string;
    entityType?: string;
    entityId?: string;
    startDate?: Date;
    endDate?: Date;
    skip?: number;
    take?: number;
}

@Injectable()
export class AuditLogsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create a new audit log entry
     */
    async create(data: CreateAuditLogDto) {
        return this.prisma.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                entityType: data.entityType,
                entityId: data.entityId,
                metadata: data.metadata,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }

    /**
     * Get audit logs with filtering and pagination
     */
    async findAll(query: AuditLogQuery) {
        const where: any = {};

        if (query.userId) where.userId = query.userId;
        if (query.action) where.action = query.action;
        if (query.entityType) where.entityType = query.entityType;
        if (query.entityId) where.entityId = query.entityId;

        if (query.startDate || query.endDate) {
            where.createdAt = {};
            if (query.startDate) where.createdAt.gte = query.startDate;
            if (query.endDate) where.createdAt.lte = query.endDate;
        }

        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                skip: query.skip || 0,
                take: query.take || 50,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            }),
            this.prisma.auditLog.count({ where }),
        ]);

        return { logs, total, skip: query.skip || 0, take: query.take || 50 };
    }

    /**
     * Get a single audit log by ID
     */
    async findOne(id: string) {
        return this.prisma.auditLog.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }

    /**
     * Get logs by user ID
     */
    async findByUser(userId: string, skip = 0, take = 50) {
        return this.findAll({ userId, skip, take });
    }

    /**
     * Get logs by entity
     */
    async findByEntity(entityType: string, entityId: string, skip = 0, take = 50) {
        return this.findAll({ entityType, entityId, skip, take });
    }

    /**
     * Get logs by action type
     */
    async findByAction(action: string, skip = 0, take = 50) {
        return this.findAll({ action, skip, take });
    }

    /**
     * Get recent activity summary
     */
    async getActivitySummary(days = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const actionCounts = await this.prisma.auditLog.groupBy({
            by: ['action'],
            _count: true,
            where: {
                createdAt: { gte: startDate },
            },
        });

        const entityCounts = await this.prisma.auditLog.groupBy({
            by: ['entityType'],
            _count: true,
            where: {
                createdAt: { gte: startDate },
            },
        });

        const activeUsers = await this.prisma.auditLog.groupBy({
            by: ['userId'],
            _count: true,
            where: {
                createdAt: { gte: startDate },
            },
            orderBy: {
                _count: {
                    userId: 'desc',
                },
            },
            take: 10,
        });

        return {
            actionCounts,
            entityCounts,
            activeUsers,
            period: { startDate, endDate: new Date(), days },
        };
    }
}
