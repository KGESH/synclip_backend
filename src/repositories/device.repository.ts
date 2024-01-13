import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Device } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import {
  IDevice,
  IDeviceCreate,
  IDeviceQuery,
  IDevicesQuery,
  IDeviceUpdate,
} from '../dtos/device.dto';
import { BaseRepository } from './base.repository';

@Injectable()
export class DeviceRepository extends BaseRepository<Device, IDevice> {
  private readonly logger = new Logger(DeviceRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(device: Device): IDevice {
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
      return this._handlePrismaNotFoundError(e);
    }
  }

  async findMany({ userId }: IDevicesQuery): Promise<IDevice[]> {
    try {
      const devices = await this.prisma.device.findMany({
        where: {
          userId,
        },
      });

      return devices.map((user) => this._transform(user));
    } catch (e) {
      this._handlePrismaError(e);
    }
  }

  async create({
    userId,
    mac,
    alias,
    deviceType,
    fcmToken,
  }: IDeviceCreate): Promise<IDevice> {
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
      this._handlePrismaError(e, `Device already exists. Check MAC address.`);
    }
  }

  async update({ id, ...data }: IDeviceUpdate): Promise<IDevice> {
    try {
      const device = await this.prisma.device.update({
        where: { id },
        data,
      });

      return this._transform(device);
    } catch (e) {
      this._handlePrismaError(e);
    }
  }
}
