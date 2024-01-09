import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DriveRepository } from '../repositories/drive.repository';
import { IDrive, IDriveCreate, IDriveUpdate } from '../dtos/drive.dto';
import { IResponse } from '../dtos/response.dto';
import { PRISMA_UNIQUE_CONSTRAINT_FAILED } from '../constants/prisma.constant';

@Injectable()
export class DriveService {
  private readonly logger = new Logger(DriveService.name);

  constructor(private readonly driveRepository: DriveRepository) {}

  async findDrive(dto: Pick<IDrive, 'userId'>) {
    return this.driveRepository.findBy(dto);
  }

  async createDrive(dto: IDriveCreate): Promise<IResponse<IDrive>> {
    try {
      const drive = await this.driveRepository.create(dto);
      return {
        status: 'success',
        data: drive,
      };
    } catch (e) {
      // Unique constraint error
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PRISMA_UNIQUE_CONSTRAINT_FAILED) {
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
