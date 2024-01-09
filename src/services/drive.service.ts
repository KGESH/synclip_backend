import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DriveRepository } from '../repositories/drive.repository';
import {
  IDrive,
  IDriveCreate,
  IDriveResponse,
  IDriveUpdate,
} from '../dtos/drive.dto';

@Injectable()
export class DriveService {
  private readonly logger = new Logger(DriveService.name);

  constructor(private readonly driveRepository: DriveRepository) {}

  async findDrive(dto: Pick<IDrive, 'userId'>) {
    return this.driveRepository.findBy(dto);
  }

  async createDrive(dto: IDriveCreate): Promise<IDriveResponse> {
    try {
      const drive = await this.driveRepository.create(dto);
      return {
        status: 'success',
        data: drive,
      };
    } catch (e) {
      // Unique constraint error
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return {
            status: 'error',
            message: `Synclip folders already exists. Check your drive ids.`,
          };
        }
      }

      return {
        status: 'error',
        message: `Unknown error ${e}`,
      };
    }
  }

  async updateFolderId(dto: IDriveUpdate) {
    return this.driveRepository.update(dto);
  }
}
