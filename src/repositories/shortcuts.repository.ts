import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Shortcuts } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';

import {
  IShortcuts,
  IShortcutsCreate,
  IShortcutsSchema,
  IShortcutsUpdate,
} from '../dtos/shortcuts.dto';
import { v4 as uuidv4 } from 'uuid';

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
    const shortcuts = await this.prismaService.shortcuts.create({
      data: {
        id: uuidv4(),
        ...dto,
      },
    });

    return this._transform(shortcuts);
  }

  async findBy({ userId }: Pick<IShortcuts, 'userId'>) {
    try {
      const shortcuts = await this.prismaService.shortcuts.findUniqueOrThrow({
        where: {
          userId,
        },
      });

      return this._transform(shortcuts);
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

  async update({ userId, shortcuts }: IShortcutsUpdate) {
    const updated = await this.prismaService.shortcuts.update({
      where: {
        userId,
      },
      data: {
        shortcuts,
      },
    });

    return this._transform(updated);
  }
}
