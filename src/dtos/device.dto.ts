import { tags } from 'typia';

import { DeviceType } from '@prisma/client';
import { IUser } from './user.dto';

export type IDevice = {
  id: string & tags.Format<'uuid'>;
  userId: string & tags.Format<'uuid'>;
  mac: string & tags.Pattern<'^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$'>;
  alias: string & tags.MinLength<1> & tags.MaxLength<50>;
  deviceType: DeviceType;
  fcmToken: string;
};

export type IDeviceCreate = Omit<IDevice, 'id'>;

export type IDeviceUpdate = Pick<IDevice, 'id'> & Partial<IDevice>;

export type IDeviceQuery = Partial<Pick<IDevice, 'id' | 'mac'>>;

export type IDevicesQuery = Partial<
  Pick<IDevice, 'userId'> & Pick<IUser, 'email'>
>;

export type IDeviceResponseSuccess = {
  status: 'success';
  data: IDevice;
};

export type IDevicesResponseSuccess = {
  status: 'success';
  data: IDevice[];
};

export type IDeviceResponseFail = {
  status: 'error' | 'not_found';
  message: string;
};

export type IDeviceResponse = IDeviceResponseSuccess | IDeviceResponseFail;

export type IDevicesResponse = IDevicesResponseSuccess | IDeviceResponseFail;
