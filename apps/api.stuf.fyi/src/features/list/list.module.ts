import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ListController } from './list.controller';
import { ListService } from './list.service';

@Module({
    imports: [AuthModule, PrismaModule],
    controllers: [ListController],
    providers: [ListService],
})
export class ListModule {}
