import { tags } from 'typia';

export type INotifyEvent = 'ping' | 'pong' | 'copy' | 'paste';

export type INotify<T> = {
  userId: string & tags.Format<'uuid'>;
  event: INotifyEvent;
  data: T;
};
