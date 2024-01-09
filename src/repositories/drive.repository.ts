import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Prisma, Drive } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { IDrive, IDriveCreate, IDriveUpdate } from '../dtos/drive.dto';
import {
  PRISMA_ENTITY_NOT_FOUND,
  PRISMA_UNIQUE_CONSTRAINT_FAILED,
} from '../constants/prisma.constant';
import { UnknownException } from '../exceptions/unknown.exception';

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
        if (e.code === PRISMA_ENTITY_NOT_FOUND) return null;
      }

      throw new UnknownException(e);
    }
  }

  async create(dto: IDriveCreate) {
    try {
      const drive = await this.prisma.drive.create({
        data: {
          id: uuidv4(),
          ...dto,
        },
      });

      return this._transform(drive);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PRISMA_UNIQUE_CONSTRAINT_FAILED) {
          throw new ConflictException({
            message: `Synclip folders already exists. Check your drive ids.`,
          });
        }
      }

      throw new UnknownException(e);
    }
  }

  async update({ userId, ...data }: IDriveUpdate) {
    try {
      const drive = await this.prisma.drive.update({
        where: { userId },
        data,
      });

      return this._transform(drive);
    } catch (e) {
      throw new UnknownException(e);
    }
  }
}
