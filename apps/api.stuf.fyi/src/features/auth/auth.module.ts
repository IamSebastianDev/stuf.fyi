import { Module } from '@nestjs/common';
import { CookieModule } from '../../core/cookies/cookie.module';
import { ConfigModule } from '../../core/config/config.module';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionGuard } from './session.guard';
import { SessionService } from './session.service';

@Module({
    imports: [ConfigModule, CookieModule, PrismaModule],
    controllers: [AuthController],
    providers: [AuthService, SessionService, SessionGuard],
    exports: [SessionService, SessionGuard],
})
export class AuthModule {}
