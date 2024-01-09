import { SynclipException } from './synclip.exception';
import { HttpStatus } from '@nestjs/common';
import { ISynclipExceptionArgs } from './exception.types';

export class RequiredArgsException<T> extends SynclipException<T> {
  constructor({ message, data }: ISynclipExceptionArgs<T>) {
    super({
      status: 'error',
      statusCode: HttpStatus.BAD_REQUEST,
      message,
      data,
    });
  }
}
