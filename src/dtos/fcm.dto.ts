import { IBinaryFileUpload, ITextUpload } from './drive.dto';
import { IDevice } from './device.dto';

export type IFcmSilentPayload = ITextUpload | IBinaryFileUpload;

export type IFcmSilentNotification = {
  fcmToken: string;
  payload: IFcmSilentPayload;
};

export type IFcmNotificationContent = {
  title: string;
  body: string;
};

export type IFcmNotificationWithoutPayload = {
  fcmToken: string;
} & IFcmNotificationContent;

type IFcmSimpleNotify = {
  type: 'notification';
  mobiles: IDevice[];
  content: IFcmNotificationContent;
};

type IFcmSilentNotify = {
  type: 'silent';
  mobiles: IDevice[];
  payload: IFcmSilentPayload;
};

export type INotification = IFcmSimpleNotify | IFcmSilentNotify;
