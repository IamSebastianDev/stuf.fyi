import { Module } from '@nestjs/common';
import { CookieModule } from '../../core/cookies/cookie.module';
import { ConfigModule } from '../../core/config/config.module';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionModule } from '../session/session.module';

@Module({
    imports: [ConfigModule, CookieModule, PrismaModule, SessionModule, UserModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
