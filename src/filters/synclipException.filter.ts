import {
  ExceptionFilter,
  HttpException,
  Catch,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SynclipException } from '../exceptions/synclip.exception';
import { IResponse } from '../dtos/response.dto';

@Catch(SynclipException)
export class SynclipExceptionFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(SynclipExceptionFilter.name);

  catch(exception: SynclipException<T>, host: ArgumentsHost) {
    this.logger.error('Exception', exception);
    this.logger.error('Host', host);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse() as IResponse<T>;

    this.logger.debug(`Request Url`, request.url);
    this.logger.debug(`StatusCode`, statusCode);
    this.logger.debug(`Response`, exceptionResponse);

    response.status(statusCode).json(exceptionResponse);
  }
}
