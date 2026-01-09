import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { PrismaService } from '../prisma.service';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
    imports: [AuditLogsModule],
    controllers: [TeamsController],
    providers: [TeamsService, PrismaService],
    exports: [TeamsService],
})
export class TeamsModule { }
