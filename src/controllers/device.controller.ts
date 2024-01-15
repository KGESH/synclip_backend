import { Controller, Logger, Patch, Post } from '@nestjs/common';
import { DeviceService } from '../services/device.service';
import { UserService } from '../services/user.service';
import { ConnectionService } from '../services/connection.service';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import {
  IDevice,
  IDeviceCreate,
  IDeviceQuery,
  IDevicesQuery,
  IDeviceUpdate,
} from '../dtos/device.dto';
import { IResponse } from '../dtos/response.dto';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';

@Controller('devices')
export class DeviceController {
  private readonly logger = new Logger(DeviceController.name);

  constructor(
    private readonly userService: UserService,
    private readonly deviceService: DeviceService,
    private readonly connection: ConnectionService,
  ) {}

  @TypedRoute.Get('/')
  async getDevice(
    @TypedQuery() query: IDeviceQuery,
  ): Promise<IResponse<IDevice>> {
    this.logger.log(`[${this.getDevice.name}]`, query);

    const device = await this.deviceService.findDevice(query);

    if (!device)
      throw new EntityNotfoundException({ message: 'device not found' });

    return {
      status: 'success',
      data: device,
    };
  }

  @TypedRoute.Get('/all')
  async getDevices(
    @TypedQuery() query: IDevicesQuery,
  ): Promise<IResponse<IDevice[]>> {
    this.logger.log(`[${this.getDevices.name}]`, query);

    const devices = await this.deviceService.findDevices(query);

    if (devices?.length === 0)
      throw new EntityNotfoundException({ message: 'devices not found' });

    return {
      status: 'success',
      data: devices,
    };
  }

  @Post('/')
  async registerDevice(
    @TypedBody() dto: IDeviceCreate,
  ): Promise<IResponse<IDevice>> {
    this.logger.log(`[${this.registerDevice.name}]`, dto);

    const user = this.userService.findUser({ id: dto.userId });

    if (!user) new EntityNotfoundException({ message: 'user not found' });

    const device = await this.deviceService.registerDevice(dto);

    this.connection.updateConnection(device);

    return {
      status: 'success',
      data: device,
    };
  }

  @Patch('/fcm')
  async updateFcmToken(
    @TypedBody()
    dto: Pick<IDeviceUpdate, 'id' | 'fcmToken'>,
  ): Promise<IResponse<IDevice>> {
    this.logger.log(`[${this.updateFcmToken.name}]`, dto);
    const updated = await this.deviceService.updateDeviceFcmToken(dto);
    return {
      status: 'success',
      data: updated,
    };
  }
}
