import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Drive } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { IDrive, IDriveCreate, IDriveUpdate } from '../dtos/drive.dto';
import { BaseRepository } from './base.repository';

@Injectable()
export class DriveRepository extends BaseRepository<Drive, IDrive> {
  private readonly logger = new Logger(DriveRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(drive: Drive): IDrive {
    return {
      id: drive.id,
      userId: drive.userId,
      baseFolderId: drive.baseFolderId,
      textFolderId: drive.textFolderId,
      fileFolderId: drive.fileFolderId,
    };
  }

  async findBy({ userId }: Pick<IDrive, 'userId'>): Promise<IDrive | null> {
    try {
      const drive = await this.prisma.drive.findUniqueOrThrow({
        where: {
          userId,
        },
      });

      return this._transform(drive);
    } catch (e) {
      return this._handlePrismaNotFoundError(e, `Drive not found.`);
    }
  }

  async create(dto: IDriveCreate): Promise<IDrive> {
    try {
      const drive = await this.prisma.drive.create({
        data: {
          id: uuidv4(),
          ...dto,
        },
      });

      return this._transform(drive);
    } catch (e) {
      this._handlePrismaError(e, `Synclip folders already exists.`);
    }
  }

  async update({ userId, ...data }: IDriveUpdate): Promise<IDrive> {
    try {
      const drive = await this.prisma.drive.update({
        where: { userId },
        data,
      });

      return this._transform(drive);
    } catch (e) {
      this._handlePrismaError(e);
    }
  }
}
