import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Prisma, Drive } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import {
  IDrive,
  IDriveCreate,
  IDriveFoldersQuery,
  IDriveUpdate,
} from '../dtos/drive.dto';

@Injectable()
export class DriveRepository {
  private readonly logger = new Logger(DriveRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  private _transform(drive: Drive): IDrive {
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
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // Not found
        if (e.code === 'P2025') {
          return null;
        }
      }

      this.logger.error(e);
      throw new Error(e);
    }
  }

  async create(dto: IDriveCreate) {
    const drive = await this.prisma.drive.create({
      data: {
        id: uuidv4(),
        ...dto,
      },
    });

    return this._transform(drive);
  }

  async update({ userId, ...data }: IDriveUpdate) {
    const drive = await this.prisma.drive.update({
      where: { userId },
      data,
    });

    return this._transform(drive);
  }
}
