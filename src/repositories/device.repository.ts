import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Prisma, Device } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import {
  IDevice,
  IDeviceCreate,
  IDeviceQuery,
  IDevicesQuery,
  IDeviceUpdate,
} from '../dtos/device.dto';
import {
  PRISMA_ENTITY_NOT_FOUND,
  PRISMA_UNIQUE_CONSTRAINT_FAILED,
} from '../constants/prisma.constant';
import { EntityConflictException } from '../exceptions/entityConflict.exception';
import { UnknownException } from '../exceptions/unknown.exception';

@Injectable()
export class DeviceRepository {
  private readonly logger = new Logger(DeviceRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  private _transform(device: Device): IDevice {
    return {
      id: device.id,
      userId: device.userId,
      mac: device.mac.toLowerCase(),
      alias: device.alias,
      deviceType: device.deviceType,
      fcmToken: device.fcmToken,
    };
  }

  async findBy({ id, mac }: IDeviceQuery): Promise<IDevice | null> {
    try {
      const device = await this.prisma.device.findUniqueOrThrow({
        where: {
          id,
          mac,
        },
      });

      return this._transform(device);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // Not found
        if (e.code === PRISMA_ENTITY_NOT_FOUND) {
          return null;
        }
      }

      this.logger.error(e);
      throw new Error(e);
    }
  }

  async findMany({ userId }: IDevicesQuery): Promise<IDevice[]> {
    const devices = await this.prisma.device.findMany({
      where: {
        userId,
      },
    });

    return devices.map((user) => this._transform(user));
  }

  async create({ userId, mac, alias, deviceType, fcmToken }: IDeviceCreate) {
    try {
      const device = await this.prisma.device.create({
        data: {
          id: uuidv4(),
          userId,
          mac,
          alias,
          deviceType,
          fcmToken,
        },
      });

      return this._transform(device);
    } catch (e) {
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

  async update({ id, ...data }: IDeviceUpdate) {
    try {
      const device = await this.prisma.device.update({
        where: { id },
        data,
      });

      return this._transform(device);
    } catch (e) {
      throw new UnknownException(e);
    }
  }
}
