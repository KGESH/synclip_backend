import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Shortcuts } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';

import {
  IShortcuts,
  IShortcutsCreate,
  IShortcutsSchema,
  IShortcutsUpdate,
  IShortQuery,
} from '../dtos/shortcuts.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  PRISMA_ENTITY_NOT_FOUND,
  PRISMA_UNIQUE_CONSTRAINT_FAILED,
} from '../constants/prisma.constant';
import { UnknownException } from '../exceptions/unknown.exception';
import { EntityConflictException } from '../exceptions/entityConflict.exception';

@Injectable()
export class ShortcutsRepository {
  private readonly logger = new Logger(ShortcutsRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  private _transform(shortcuts: Shortcuts): IShortcuts {
    return {
      id: shortcuts.id,
      userId: shortcuts.userId,
      shortcuts: shortcuts.shortcuts as IShortcutsSchema,
    };
  }

  async create(dto: IShortcutsCreate) {
    try {
      const shortcuts = await this.prismaService.shortcuts.create({
        data: {
          id: uuidv4(),
          ...dto,
        },
      });

      return this._transform(shortcuts);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PRISMA_UNIQUE_CONSTRAINT_FAILED) {
          throw new EntityConflictException({
            message: `User already created default shortcuts.`,
          });
        }
      }

      throw new UnknownException(e);
    }
  }

  async findBy({ userId }: IShortQuery) {
    try {
      const shortcuts = await this.prismaService.shortcuts.findUniqueOrThrow({
        where: {
          userId,
        },
      });

      return this._transform(shortcuts);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PRISMA_ENTITY_NOT_FOUND) return null;
      }

      throw new UnknownException(e);
    }
  }

  async update({ userId, shortcuts }: IShortcutsUpdate) {
    try {
      const updated = await this.prismaService.shortcuts.update({
        where: {
          userId,
        },
        data: {
          shortcuts,
        },
      });

      return this._transform(updated);
    } catch (e) {
      throw new UnknownException(e);
    }
  }
}
