import { SynclipException } from './synclip.exception';
import { ISynclipExceptionArgs } from './exception.types';
import { HttpStatus } from '@nestjs/common';

export class EntityConflictException<T> extends SynclipException<T> {
  constructor({ message, data }: ISynclipExceptionArgs<T>) {
    super({
      status: 'error',
      statusCode: HttpStatus.CONFLICT,
      message,
      data,
    });
  }
}
