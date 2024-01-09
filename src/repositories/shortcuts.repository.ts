import { Injectable, Logger } from '@nestjs/common';
import { Shortcuts } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import {
  IShortcuts,
  IShortcutsCreate,
  IShortcutsSchema,
  IShortcutsUpdate,
  IShortQuery,
} from '../dtos/shortcuts.dto';
import { v4 as uuidv4 } from 'uuid';
import { BaseRepository } from './base.repository';

@Injectable()
export class ShortcutsRepository extends BaseRepository<Shortcuts, IShortcuts> {
  private readonly logger = new Logger(ShortcutsRepository.name);

  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  protected _transform(shortcuts: Shortcuts): IShortcuts {
    return {
      id: shortcuts.id,
      userId: shortcuts.userId,
      shortcuts: shortcuts.shortcuts as IShortcutsSchema,
      updatedAt: shortcuts.updatedAt.toISOString(),
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
      this._handlePrismaError(e, `User already created default shortcuts.`);
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
      return this._handlePrismaNotFoundError(e, `Shortcuts not found.`);
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
      this._handlePrismaError(e);
    }
  }
}
