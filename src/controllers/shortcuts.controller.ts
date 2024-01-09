import { Controller, Logger } from '@nestjs/common';
import { ShortcutsService } from '../services/shortcuts.service';
import { UserService } from '../services/user.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import {
  IShortcuts,
  IShortcutsCreate,
  IShortcutsUpdate,
} from '../dtos/shortcuts.dto';
import { IResponse } from '../dtos/response.dto';
import { tags } from 'typia';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';

@Controller('shortcuts')
export class ShortcutsController {
  private readonly logger = new Logger(ShortcutsController.name);

  constructor(
    private readonly userService: UserService,
    private readonly shortcutsService: ShortcutsService,
  ) {}

  @TypedRoute.Get('/:userId')
  async getShortcuts(
    @TypedParam('userId') userId: string & tags.Format<'uuid'>,
  ): Promise<IResponse<IShortcuts>> {
    this.logger.debug(`[${this.getShortcuts.name}]`, userId);

    const user = await this.userService.findUser({ id: userId });

    if (!user) throw new EntityNotfoundException({ message: 'user not found' });

    const shortcuts = await this.shortcutsService.findShortcuts({ userId });

    if (!shortcuts)
      throw new EntityNotfoundException({ message: 'shortcuts not found' });

    return {
      status: 'success',
      data: shortcuts,
    };
  }

  @TypedRoute.Post('/')
  async createShortcuts(
    @TypedBody() dto: IShortcutsCreate,
  ): Promise<IResponse<IShortcuts>> {
    this.logger.debug(`[${this.createShortcuts.name}]`, dto);

    const user = await this.userService.findUser({ id: dto.userId });

    if (!user) throw new EntityNotfoundException({ message: 'user not found' });

    const shortcuts = await this.shortcutsService.createShortcuts(dto);

    return {
      status: 'success',
      data: shortcuts,
    };
  }

  @TypedRoute.Patch('/')
  async updateShortcuts(@TypedBody() dto: IShortcutsUpdate) {
    this.logger.debug(`[updateShortcuts] Body: `, dto);

    const user = await this.userService.findUser({ id: dto.userId });

    if (!user) throw new EntityNotfoundException({ message: 'user not found' });

    return this.shortcutsService.updateShortcuts(dto);
  }
}
