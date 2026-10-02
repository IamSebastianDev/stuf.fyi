import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
    async getHealth() {
        return { ok: true, timestamp: new Date(Date.now()) };
    }
}
