import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { DeviceController } from '../controllers/device.controller';
import { DeviceService } from '../services/device.service';
import { PrismaModule } from './prisma.module';
import { ConnectionModule } from './connection.module';
import { DeviceRepository } from '../repositories/device.repository';

@Module({
  imports: [UserModule, PrismaModule, ConnectionModule],
  controllers: [DeviceController],
  providers: [DeviceService, DeviceRepository],
  exports: [DeviceService],
})
export class DeviceModule {}
