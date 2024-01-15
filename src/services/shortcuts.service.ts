import { Injectable, Logger } from '@nestjs/common';
import { ShortcutsRepository } from '../repositories/shortcuts.repository';
import {
  IShortcuts,
  IShortcutsCreate,
  IShortcutsUpdate,
  IShortQuery,
} from '../dtos/shortcuts.dto';
import { UnknownException } from '../exceptions/unknown.exception';

@Injectable()
export class ShortcutsService {
  private readonly logger = new Logger(ShortcutsService.name);

  constructor(private readonly shortcutsRepository: ShortcutsRepository) {}

  async createShortcuts(dto: IShortcutsCreate): Promise<IShortcuts> {
    return await this.shortcutsRepository.create(dto);
  }

  async findShortcuts(query: IShortQuery): Promise<IShortcuts | null> {
    return this.shortcutsRepository.findBy(query);
  }

  async updateShortcuts(dto: IShortcutsUpdate): Promise<IShortcuts> {
    try {
      return this.shortcutsRepository.update(dto);
    } catch (e) {
      throw new UnknownException(e);
    }
  }
}
