import { INotifyEvent } from './notify.dto';
import { tags } from 'typia';
import { DeviceType } from '@prisma/client';

export type ISocketConnection = {
  socketId: string;
  mac: string & tags.Pattern<'^([0-9a-f]{2}[:-]){5}([0-9a-f]{2})$'>;
  userId: string | null;
  deviceId: (string & tags.Format<'uuid'>) | null;
  deviceType: DeviceType;
};

export type ISocketMessage<T> = {
  connectionIds: string[];
  event: INotifyEvent;
  data: T;
};
