import { SynclipException } from './synclip.exception';
import { HttpStatus } from '@nestjs/common';
import { ISynclipExceptionArgs } from './exception.types';

export class EntityNotfoundException<T> extends SynclipException<T> {
  constructor({ message, data }: ISynclipExceptionArgs<T>) {
    super({
      status: 'not_found',
      statusCode: HttpStatus.NOT_FOUND,
      message,
      data,
    });
  }
}
