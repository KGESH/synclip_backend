import { Module } from '@nestjs/common';
import { UserModule } from './modules/user.module';
import { NotifyModule } from './modules/notify.module';
import { DeviceModule } from './modules/device.module';
import { ConnectionModule } from './modules/connection.module';
import { DriveModule } from './modules/drive.module';
import { ShortcutsModule } from './modules/shortcuts.module';
import { ConfigModule } from '@nestjs/config';
import { readFirebaseAdminConfigs } from './configs/firebase.configs';
import { FirebaseModule } from './modules/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env' : '.env.dev',
      load: [readFirebaseAdminConfigs],
    }),
    FirebaseModule,
    UserModule,
    DeviceModule,
    DriveModule,
    ConnectionModule,
    NotifyModule,
    ShortcutsModule,
  ],
})
export class AppModule {}
