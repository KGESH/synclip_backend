import { SynclipException } from './synclip.exception';
import { HttpStatus, Logger } from '@nestjs/common';
import { ISynclipExceptionArgs } from './exception.types';

export class UnknownException<T> extends SynclipException<T> {
  private readonly logger = new Logger(UnknownException.name);

  constructor(
    e: Error | unknown,
    { message, data }: ISynclipExceptionArgs<T> = {
      message: 'Unknown error',
    },
  ) {
    super({
      status: 'error',
      message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });

    // Only logging. Not response to client
    this.logger.error(e);
  }
}
