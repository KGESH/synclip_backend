import { Injectable, Logger } from '@nestjs/common';
import { DeviceRepository } from '../repositories/device.repository';
import {
  IDevice,
  IDeviceCreate,
  IDeviceQuery,
  IDevicesQuery,
  IDeviceUpdate,
} from '../dtos/device.dto';
import { RequiredArgsException } from '../exceptions/requiredArgs.exception';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);

  constructor(private readonly deviceRepository: DeviceRepository) {}

  async findDevice(query: IDeviceQuery) {
    if (!query.id && !query.mac)
      throw new RequiredArgsException({ message: 'id or mac is required' });

    return this.deviceRepository.findBy(query);
  }

  async findDevices(query: IDevicesQuery): Promise<IDevice[]> {
    if (!query.userId && !query.email) {
      throw new RequiredArgsException({
        message: 'userId or email is required',
      });
    }

    return this.deviceRepository.findMany(query);
  }

  private async _createDevice(dto: IDeviceCreate) {
    return await this.deviceRepository.create(dto);
  }

  async registerDevice(dto: IDeviceCreate): Promise<IDevice> {
    // Todo: Pricing plan check
    // Todo: Maximum device count check
    return await this._createDevice(dto);
  }

  private async _updateDevice(dto: IDeviceUpdate): Promise<IDevice> {
    return this.deviceRepository.update(dto);
  }

  async updateDeviceFcmToken(
    dto: Pick<IDeviceUpdate, 'id' | 'fcmToken'>,
  ): Promise<IDevice> {
    return this._updateDevice(dto);
  }
}
