import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { CookieService } from './cookie.service';

@Module({
    imports: [ConfigModule],
    providers: [CookieService],
    exports: [CookieService],
})
export class CookieModule {}
