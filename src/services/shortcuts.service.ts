import { Injectable, Logger } from '@nestjs/common';
import { ShortcutsRepository } from '../repositories/shortcuts.repository';
import {
  IShortcuts,
  IShortcutsCreate,
  IShortcutsUpdate,
} from '../dtos/shortcuts.dto';
import { Prisma } from '@prisma/client';
import { IResponse } from '../dtos/response.dto';

@Injectable()
export class ShortcutsService {
  private readonly logger = new Logger(ShortcutsService.name);

  constructor(private readonly shortcutsRepository: ShortcutsRepository) {}

  async createShortcuts(dto: IShortcutsCreate): Promise<IResponse<IShortcuts>> {
    try {
      const shortcuts = await this.shortcutsRepository.create(dto);
      return {
        status: 'success',
        data: shortcuts,
      };
    } catch (e) {
      // Unique constraint error
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return {
            status: 'error',
            message: `User already created default shortcuts.`,
          };
        }
      }

      return {
        status: 'error',
        message: `Unknown error ${e}`,
      };
    }
  }

  async findShortcuts(dto: Pick<IShortcutsCreate, 'userId'>) {
    return this.shortcutsRepository.findBy(dto);
  }

  async updateShortcuts(dto: IShortcutsUpdate) {
    return this.shortcutsRepository.update(dto);
  }
}
