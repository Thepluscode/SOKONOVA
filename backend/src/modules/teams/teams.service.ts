import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

export interface CreateTeamDto {
    name: string;
    description?: string;
    createdById: string;
}

export interface UpdateTeamDto {
    name?: string;
    description?: string;
}

export interface AddMemberDto {
    userId: string;
    role?: string;
    invitedBy?: string;
}

export interface UpdateMemberRoleDto {
    role: string;
}

@Injectable()
export class TeamsService {
    constructor(
        private prisma: PrismaService,
        private auditLogs: AuditLogsService,
    ) { }

    /**
     * Create a new team
     */
    async create(data: CreateTeamDto, ipAddress?: string, userAgent?: string) {
        const team = await this.prisma.team.create({
            data: {
                name: data.name,
                description: data.description,
                createdById: data.createdById,
                members: {
                    create: {
                        userId: data.createdById,
                        role: 'OWNER',
                    },
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, role: true },
                        },
                    },
                },
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        // Log the action
        await this.auditLogs.create({
            userId: data.createdById,
            action: 'CREATE_TEAM',
            entityType: 'TEAM',
            entityId: team.id,
            metadata: { teamName: team.name },
            ipAddress,
            userAgent,
        });

        return team;
    }

    /**
     * Get all teams
     */
    async findAll(skip = 0, take = 50) {
        const [teams, total] = await Promise.all([
            this.prisma.team.findMany({
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    members: {
                        include: {
                            user: {
                                select: { id: true, name: true, email: true, role: true },
                            },
                        },
                    },
                    createdBy: {
                        select: { id: true, name: true, email: true },
                    },
                    _count: {
                        select: { members: true },
                    },
                },
            }),
            this.prisma.team.count(),
        ]);

        return { teams, total, skip, take };
    }

    /**
     * Get a team by ID
     */
    async findOne(id: string) {
        const team = await this.prisma.team.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, role: true },
                        },
                    },
                    orderBy: { joinedAt: 'asc' },
                },
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        if (!team) {
            throw new NotFoundException(`Team with ID ${id} not found`);
        }

        return team;
    }

    /**
     * Update a team
     */
    async update(
        id: string,
        data: UpdateTeamDto,
        updatedById: string,
        ipAddress?: string,
        userAgent?: string,
    ) {
        const team = await this.findOne(id);

        const updated = await this.prisma.team.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, role: true },
                        },
                    },
                },
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        await this.auditLogs.create({
            userId: updatedById,
            action: 'UPDATE_TEAM',
            entityType: 'TEAM',
            entityId: id,
            metadata: { oldName: team.name, newName: data.name || team.name },
            ipAddress,
            userAgent,
        });

        return updated;
    }

    /**
     * Delete a team
     */
    async delete(id: string, deletedById: string, ipAddress?: string, userAgent?: string) {
        const team = await this.findOne(id);

        await this.prisma.team.delete({ where: { id } });

        await this.auditLogs.create({
            userId: deletedById,
            action: 'DELETE_TEAM',
            entityType: 'TEAM',
            entityId: id,
            metadata: { teamName: team.name },
            ipAddress,
            userAgent,
        });

        return { message: 'Team deleted successfully', id };
    }

    /**
     * Add a member to a team
     */
    async addMember(
        teamId: string,
        data: AddMemberDto,
        addedById: string,
        ipAddress?: string,
        userAgent?: string,
    ) {
        await this.findOne(teamId);

        // Check if user is already a member
        const exists = await this.prisma.teamMember.findUnique({
            where: { teamId_userId: { teamId, userId: data.userId } },
        });

        if (exists) {
            throw new ConflictException('User is already a member of this team');
        }

        const member = await this.prisma.teamMember.create({
            data: {
                teamId,
                userId: data.userId,
                role: data.role || 'MEMBER',
                invitedBy: data.invitedBy || addedById,
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true, role: true },
                },
                team: {
                    select: { id: true, name: true },
                },
            },
        });

        await this.auditLogs.create({
            userId: addedById,
            action: 'ADD_TEAM_MEMBER',
            entityType: 'TEAM_MEMBER',
            entityId: member.id,
            metadata: { teamId, userId: data.userId, memberRole: data.role },
            ipAddress,
            userAgent,
        });

        return member;
    }

    /**
     * Remove a member from a team
     */
    async removeMember(
        teamId: string,
        userId: string,
        removedById: string,
        ipAddress?: string,
        userAgent?: string,
    ) {
        const member = await this.prisma.teamMember.findUnique({
            where: { teamId_userId: { teamId, userId } },
            include: {
                user: { select: { name: true } },
                team: { select: { name: true, createdById: true } },
            },
        });

        if (!member) {
            throw new NotFoundException('Team member not found');
        }

        // Prevent removing the owner
        if (member.role === 'OWNER') {
            throw new ForbiddenException('Cannot remove the team owner');
        }

        await this.prisma.teamMember.delete({
            where: { teamId_userId: { teamId, userId } },
        });

        await this.auditLogs.create({
            userId: removedById,
            action: 'REMOVE_TEAM_MEMBER',
            entityType: 'TEAM_MEMBER',
            entityId: `${teamId}:${userId}`,
            metadata: { teamId, userId, userName: member.user.name },
            ipAddress,
            userAgent,
        });

        return { message: 'Member removed successfully', teamId, userId };
    }

    /**
     * Update a member's role
     */
    async updateMemberRole(
        teamId: string,
        userId: string,
        data: UpdateMemberRoleDto,
        updatedById: string,
        ipAddress?: string,
        userAgent?: string,
    ) {
        const member = await this.prisma.teamMember.findUnique({
            where: { teamId_userId: { teamId, userId } },
        });

        if (!member) {
            throw new NotFoundException('Team member not found');
        }

        // Prevent changing owner role
        if (member.role === 'OWNER' && data.role !== 'OWNER') {
            throw new ForbiddenException('Cannot demote the team owner');
        }

        const updated = await this.prisma.teamMember.update({
            where: { teamId_userId: { teamId, userId } },
            data: { role: data.role },
            include: {
                user: {
                    select: { id: true, name: true, email: true, role: true },
                },
            },
        });

        await this.auditLogs.create({
            userId: updatedById,
            action: 'UPDATE_TEAM_MEMBER_ROLE',
            entityType: 'TEAM_MEMBER',
            entityId: member.id,
            metadata: { teamId, userId, oldRole: member.role, newRole: data.role },
            ipAddress,
            userAgent,
        });

        return updated;
    }

    /**
     * Get teams for a user
     */
    async findByUser(userId: string) {
        return this.prisma.teamMember.findMany({
            where: { userId },
            include: {
                team: {
                    include: {
                        createdBy: {
                            select: { id: true, name: true, email: true },
                        },
                        _count: {
                            select: { members: true },
                        },
                    },
                },
            },
        });
    }
}
