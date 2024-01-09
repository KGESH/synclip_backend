import { Module } from '@nestjs/common';
import { UserModule } from './modules/user.module';
import { NotifyModule } from './modules/notify.module';
import { DeviceModule } from './modules/device.module';
import { ConnectionModule } from './modules/connection.module';
import { DriveModule } from './modules/drive.module';
import { ShortcutsModule } from './modules/shortcuts.module';

@Module({
  imports: [
    UserModule,
    DeviceModule,
    DriveModule,
    ConnectionModule,
    NotifyModule,
    ShortcutsModule,
  ],
})
export class AppModule {}
