import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '../../core/config/config.module';
import { CookieModule } from '../../core/cookies/cookie.module';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ChallengeCookieService } from './challenge-cookie.service';
import { RegistrationVerificationService } from './registration-verification.service';

@Module({
    imports: [
        ConfigModule,
        CookieModule,
        PrismaModule,
        SessionModule,
        UserModule,
        MailModule,
        ThrottlerModule.forRoot([{ ttl: 60_000, limit: 5 }]),
    ],
    controllers: [AuthController],
    providers: [AuthService, ChallengeCookieService, RegistrationVerificationService],
})
export class AuthModule {}
