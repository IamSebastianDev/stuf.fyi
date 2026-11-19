import { Injectable } from '@nestjs/common';
import type { CreateListRequestDto } from '@stuf/contracts/list';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class ListService {
    constructor(private readonly prisma: PrismaService) {}

    /** Creates a list and grants its owner membership in a single transaction. */
    create(userId: string, { name, icon, mealsEnabled }: CreateListRequestDto) {
        return this.prisma.client.$transaction(async (transaction) => {
            const list = await transaction.list.create({
                data: { name, icon: icon ?? (mealsEnabled ? '🧺' : '🛒'), mealsEnabled, ownerId: userId },
            });
            const membership = await transaction.listMember.create({ data: { listId: list.id, userId } });
            return { list, membership };
        });
    }

    /** Returns the lists the user can access through their memberships. */
    async findAll(userId: string) {
        const lists = await this.prisma.client.list.findMany({
            where: { members: { some: { userId } } },
            orderBy: [{ name: 'asc' }, { id: 'asc' }],
        });
        return { lists };
    }
}
