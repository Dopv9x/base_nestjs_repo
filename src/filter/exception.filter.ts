import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from '../logger/custom.logger';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ResponseTypeEnum } from '../../src/enum/response-type.enum';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  private static handleResponse(
    response: Response,
    exception: HttpException | QueryFailedError | Error,
  ): void {
    let responseBody: any = { message: 'Internal server error' };
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      responseBody = {
        message: Object(exception.getResponse())?.message || exception.message,
      };
      statusCode = exception.getStatus();
    } else if (exception instanceof QueryFailedError) {
      statusCode = HttpStatus.BAD_REQUEST;
      responseBody = {
        message: exception.message,
      };
    } else if (exception instanceof Error) {
      responseBody = {
        message: exception.stack,
      };
    }

    response
      .status(statusCode)
      .json({ type: ResponseTypeEnum.Error, ...responseBody });
  }

  catch(
    exception: HttpException | QueryFailedError | Error,
    host: ArgumentsHost,
  ): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();

    // Handling error message and logging
    this.handleMessage(exception);

    // Response to client
    AllExceptionFilter.handleResponse(response, exception);
  }

  private handleMessage(
    exception: HttpException | QueryFailedError | Error,
  ): void {
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      message = JSON.stringify(exception.getResponse());
    } else if (exception instanceof QueryFailedError) {
      message = exception.stack.toString();
    } else if (exception instanceof Error) {
      message = exception.stack.toString();
    }

    this.logger.error(message);
  }
}
