import { Module } from '@nestjs/common';
import { NotifyGateway } from '../gateways/notify.gateway';
import { UserModule } from './user.module';
import { DeviceModule } from './device.module';
import { ConnectionModule } from './connection.module';
import { FirebaseModule } from './firebase.module';

@Module({
  imports: [UserModule, DeviceModule, ConnectionModule, FirebaseModule],
  providers: [NotifyGateway],
  exports: [NotifyGateway],
})
export class NotifyModule {}
