import { Injectable, Logger } from '@nestjs/common';
import { DeviceRepository } from '../repositories/device.repository';
import {
  IDeviceCreate,
  IDeviceQuery,
  IDeviceResponse,
  IDevicesQuery,
  IDeviceUpdate,
} from '../dtos/device.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);

  constructor(private readonly deviceRepository: DeviceRepository) {}

  async findDevice(dto: IDeviceQuery) {
    return this.deviceRepository.findBy(dto);
  }

  async findDevices(args: IDevicesQuery) {
    return this.deviceRepository.findMany(args);
  }

  private async _createDevice(dto: IDeviceCreate) {
    return this.deviceRepository.create(dto);
  }

  async registerDevice(dto: IDeviceCreate): Promise<IDeviceResponse> {
    // Todo: Pricing plan check
    // Todo: Maximum device count check
    try {
      const device = await this._createDevice(dto);
      return {
        status: 'success',
        data: device,
      };
    } catch (e) {
      // Unique constraint error
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return {
            status: 'error',
            message: `Device already exists. Check your MAC address.`,
          };
        }
      }

      return {
        status: 'error',
        message: `Unknown error ${e}`,
      };
    }
  }

  private async _updateDevice(dto: IDeviceUpdate) {
    return this.deviceRepository.update(dto);
  }

  async updateDeviceFcmToken(dto: Pick<IDeviceUpdate, 'id' | 'fcmToken'>) {
    return this._updateDevice(dto);
  }
}
