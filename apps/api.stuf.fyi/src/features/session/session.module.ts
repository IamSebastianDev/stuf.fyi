import { Module } from '@nestjs/common';
import { ConfigModule } from '../../core/config/config.module';
import { CookieModule } from '../../core/cookies/cookie.module';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { SessionController } from './session.controller';
import { SessionGuard } from './session.guard';
import { SessionService } from './session.service';

@Module({
    imports: [ConfigModule, CookieModule, PrismaModule],
    controllers: [SessionController],
    providers: [SessionService, SessionGuard],
    exports: [SessionService, SessionGuard],
})
export class SessionModule {}
