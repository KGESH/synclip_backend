import { Module } from '@nestjs/common';
import { NotifyGateway } from '../gateways/notify.gateway';
import { UserModule } from './user.module';
import { DeviceModule } from './device.module';
import { ConnectionModule } from './connection.module';

@Module({
  imports: [UserModule, DeviceModule, ConnectionModule],
  providers: [NotifyGateway],
  exports: [NotifyGateway],
})
export class NotifyModule {}
