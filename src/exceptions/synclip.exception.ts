import { HttpException } from '@nestjs/common';
import { ISynclipBaseExceptionArgs } from './exception.types';

export class SynclipException<T> extends HttpException {
  constructor({ statusCode, ...response }: ISynclipBaseExceptionArgs<T>) {
    super(response, statusCode);
  }
}
