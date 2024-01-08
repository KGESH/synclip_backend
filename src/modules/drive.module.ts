import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { DriveService } from '../services/drive.service';
import { DriveController } from '../controllers/drive.controller';
import { DriveRepository } from 'src/repositories/drive.repository';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [UserModule, PrismaModule],
  controllers: [DriveController],
  providers: [DriveService, DriveRepository],
})
export class DriveModule {}
