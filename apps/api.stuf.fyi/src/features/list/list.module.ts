import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { SessionModule } from '../session/session.module';
import { ListController } from './list.controller';
import { ListService } from './list.service';

@Module({
    imports: [SessionModule, PrismaModule],
    controllers: [ListController],
    providers: [ListService],
})
export class ListModule {}
