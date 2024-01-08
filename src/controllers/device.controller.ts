import { Controller, Logger, Patch, Post } from '@nestjs/common';
import { DeviceService } from '../services/device.service';
import { UserService } from '../services/user.service';
import { ConnectionService } from '../services/connection.service';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import {
  IDeviceCreate,
  IDeviceQuery,
  IDeviceResponse,
  IDevicesQuery,
  IDevicesResponse,
  IDeviceUpdate,
} from '../dtos/device.dto';

@Controller('devices')
export class DeviceController {
  private readonly logger = new Logger(DeviceController.name);

  constructor(
    private readonly userService: UserService,
    private readonly deviceService: DeviceService,
    private readonly connection: ConnectionService,
  ) {}

  @TypedRoute.Get('/')
  async getDevice(@TypedQuery() query: IDeviceQuery): Promise<IDeviceResponse> {
    this.logger.log(`Query: `, query);

    if (!query.id && !query.mac) {
      return {
        status: 'error',
        message: 'id or mac is required',
      };
    }

    try {
      const device = await this.deviceService.findDevice(query);

      if (!device) {
        return {
          status: 'not_found',
          message: 'device not found',
        };
      }

      return {
        status: 'success',
        data: device,
      };
    } catch (e) {
      return {
        status: 'error',
        message: `Unknown error ${e}`,
      };
    }
  }

  @TypedRoute.Get('/all')
  async getDevices(
    @TypedQuery() query: IDevicesQuery,
  ): Promise<IDevicesResponse> {
    this.logger.log(`Query: `, query);

    if (!query.userId && !query.email) {
      return {
        status: 'error',
        message: 'userId or email is required',
      };
    }

    try {
      const devices = await this.deviceService.findDevices(query);

      if (!devices) {
        return {
          status: 'not_found',
          message: 'devices not found',
        };
      }

      return {
        status: 'success',
        data: devices,
      };
    } catch (e) {
      return {
        status: 'error',
        message: `Unknown error ${e}`,
      };
    }
  }

  @Post('/')
  async registerDevice(@TypedBody() dto: IDeviceCreate) {
    const user = this.userService.findUserById({ id: dto.userId });

    if (!user) {
      return {
        status: 'not_found',
        message: 'user not found',
      };
    }

    const response = await this.deviceService.registerDevice(dto);

    if (response.status === 'success') {
      this.connection.updateConnection({
        ...response.data,
      });
    }

    return response;
  }

  @Patch('/fcm')
  updateFcmToken(
    @TypedBody()
    dto: Pick<IDeviceUpdate, 'id' | 'fcmToken'>,
  ) {
    return this.deviceService.updateDeviceFcmToken(dto);
  }
}
