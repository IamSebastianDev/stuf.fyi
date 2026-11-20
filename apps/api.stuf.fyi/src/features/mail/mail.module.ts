import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailModule as NestMailModule, SmtpTransport } from '@nestjs/mail';
import { ConfigModule } from '../../core/config/config.module';
import { MailService } from './mail.service';
import { RegistrationVerificationMail } from './mailables/registration-verification.mail';

const localSmtpUrl = 'smtp://127.0.0.1:1025';

@Module({
    imports: [
        NestMailModule.forRootAsync({
            isGlobal: false,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const local = config.get('NODE_ENV', 'development') === 'development';
                const url = config.get<string>('SMTP_URL') ?? (local ? localSmtpUrl : undefined);
                const from = config.get<string>('SMTP_FROM') ?? (local ? 'Stuf <no-reply@stuf.test>' : undefined);

                return {
                    transport: new SmtpTransport({ url: url || localSmtpUrl }),
                    // Nest rejects mail without a sender before contacting the transport.
                    from: url && from ? from : undefined,
                };
            },
        }),
    ],
    providers: [MailService, RegistrationVerificationMail],
    exports: [MailService],
})
export class MailModule {}
