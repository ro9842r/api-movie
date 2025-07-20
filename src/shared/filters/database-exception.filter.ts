import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.message.includes('invalid input syntax for type uuid')) {
      const badRequestException = new BadRequestException({
        statusCode: 400,
        message: 'Invalid UUID format provided',
        error: 'Bad Request',
      });

      response.status(400).json(badRequestException.getResponse());
      return;
    }

    if (exception.message.includes('violates')) {
      const badRequestException = new BadRequestException({
        statusCode: 400,
        message: 'Database constraint violation',
        error: 'Bad Request',
      });

      response.status(400).json(badRequestException.getResponse());
      return;
    }

    response.status(500).json({
      statusCode: 500,
      message: 'Internal database error',
      error: 'Internal Server Error',
    });
  }
}
