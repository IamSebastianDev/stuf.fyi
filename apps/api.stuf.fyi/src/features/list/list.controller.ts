import { Body, Controller, Get, Post, SerializeOptions, UseGuards } from '@nestjs/common';
import {
    CreateListRequestSchema,
    CreateListResponseSchema,
    ListCollectionResponseSchema,
    type CreateListRequestDto,
} from '@stuf/contracts/list';
import { SessionUserId } from '../auth/session-user-id.decorator';
import { SessionGuard } from '../auth/session.guard';
import { ListService } from './list.service';

@Controller({ version: '1', path: '/lists' })
@UseGuards(SessionGuard)
export class ListController {
    constructor(private readonly lists: ListService) {}

    @Post()
    @SerializeOptions({ schema: CreateListResponseSchema })
    create(@SessionUserId() userId: string, @Body({ schema: CreateListRequestSchema }) body: CreateListRequestDto) {
        return this.lists.create(userId, body);
    }

    @Get()
    @SerializeOptions({ schema: ListCollectionResponseSchema })
    findAll(@SessionUserId() userId: string) {
        return this.lists.findAll(userId);
    }
}
