import { HttpException } from '@nestjs/common';
import { ResponseTypeEnum } from '@src/enum/response-type.enum';

export class ApiError extends HttpException {
  constructor(statusCode: number, message: string) {
    super(
      {
        type: ResponseTypeEnum.Error,
        message,
      },
      statusCode,
    );
  }
}
