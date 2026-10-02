import { Catch, ConflictException, NotFoundException, type ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@stuf/prisma';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const mapped = PrismaExceptionFilter.errorMap.get(exception.code);

        // If we don't have a mapping for the error, we rethrow
        // the exception, maybe something else can handle it. Or not.
        if (!mapped) {
            return super.catch(exception, host);
        }

        const { ctor, ...message } = mapped;
        super.catch(new ctor({ ...message }), host);
    }

    private static readonly errorMap = new Map([
        [
            'P2002',
            {
                status: 409,
                errorCode: 'CONFLICT',
                message: 'Resource already exists',
                ctor: ConflictException,
            },
        ],
        [
            'P2025',
            {
                status: 404,
                errorCode: 'NOT_FOUND',
                message: 'Resource not found',
                ctor: NotFoundException,
            },
        ],
    ]);
}
