import { IResponseError } from '../dtos/response.dto';

export type ISynclipBaseExceptionArgs<T> = IResponseError<T> & {
  statusCode: number;
};

export type ISynclipExceptionArgs<T> = Pick<
  ISynclipBaseExceptionArgs<T>,
  'message' | 'data'
>;
