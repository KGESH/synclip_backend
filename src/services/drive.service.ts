import { Injectable, Logger } from '@nestjs/common';
import { DriveRepository } from '../repositories/drive.repository';
import { IDrive, IDriveCreate, IDriveUpdate } from '../dtos/drive.dto';

@Injectable()
export class DriveService {
  private readonly logger = new Logger(DriveService.name);

  constructor(private readonly driveRepository: DriveRepository) {}

  async findDrive(dto: Pick<IDrive, 'userId'>): Promise<IDrive | null> {
    return this.driveRepository.findBy(dto);
  }

  async createDrive(dto: IDriveCreate): Promise<IDrive> {
    return await this.driveRepository.create(dto);
  }

  async updateFolderId(dto: IDriveUpdate): Promise<IDrive> {
    return await this.driveRepository.update(dto);
  }
}
