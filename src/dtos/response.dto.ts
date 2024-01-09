export type IResponseSuccessCause = 'success'; // Todo: add more causes

export type IResponseFailCause = 'not_found' | 'error';

export type IResponseType = IResponseSuccessCause & IResponseFailCause;

export type IResponseSuccess<T> = {
  status: IResponseSuccessCause;
  data: T;
};

export type IResponseError<T> = {
  status: IResponseFailCause;
  message: string;
  data?: T;
};

export type IResponse<T> = IResponseSuccess<T> | IResponseError<T>;
