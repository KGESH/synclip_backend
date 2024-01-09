import { Injectable, Logger } from '@nestjs/common';
import { DeviceRepository } from '../repositories/device.repository';
import {
  IDevice,
  IDeviceCreate,
  IDeviceQuery,
  IDevicesQuery,
  IDeviceUpdate,
} from '../dtos/device.dto';
import { Prisma } from '@prisma/client';
import { IResponse } from '../dtos/response.dto';
import { PRISMA_UNIQUE_CONSTRAINT_FAILED } from '../constants/prisma.constant';
import { RequiredArgsException } from '../exceptions/requiredArgs.exception';
import { EntityConflictException } from '../exceptions/entityConflict.exception';
import { UnknownException } from '../exceptions/unknown.exception';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);

  constructor(private readonly deviceRepository: DeviceRepository) {}

  async findDevice(query: IDeviceQuery) {
    if (!query.id && !query.mac)
      throw new RequiredArgsException({ message: 'id or mac is required' });

    return this.deviceRepository.findBy(query);
  }

  async findDevices(query: IDevicesQuery) {
    if (!query.userId && !query.email) {
      throw new RequiredArgsException({
        message: 'userId or email is required',
      });
    }

    return this.deviceRepository.findMany(query);
  }

  private async _createDevice(dto: IDeviceCreate) {
    return this.deviceRepository.create(dto);
  }

  async registerDevice(dto: IDeviceCreate): Promise<IDevice> {
    // Todo: Pricing plan check
    // Todo: Maximum device count check
    try {
      return await this._createDevice(dto);
    } catch (e) {
      // Unique constraint error
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PRISMA_UNIQUE_CONSTRAINT_FAILED) {
          throw new EntityConflictException({
            message: `Device already exists. Check your MAC address.`,
          });
        }
      }

      throw new UnknownException(e);
    }
  }

  private async _updateDevice(dto: IDeviceUpdate) {
    try {
      return this.deviceRepository.update(dto);
    } catch (e) {
      throw new UnknownException(e);
    }
  }

  async updateDeviceFcmToken(dto: Pick<IDeviceUpdate, 'id' | 'fcmToken'>) {
    return this._updateDevice(dto);
  }
}
