import { Controller, Logger } from '@nestjs/common';
import { ShortcutsService } from '../services/shortcuts.service';
import { UserService } from '../services/user.service';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import {
  IShortcuts,
  IShortcutsCreate,
  IShortcutsUpdate,
} from '../dtos/shortcuts.dto';
import { IResponse } from '../dtos/response.dto';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';

@Controller('shortcuts')
export class ShortcutsController {
  private readonly logger = new Logger(ShortcutsController.name);

  constructor(
    private readonly userService: UserService,
    private readonly shortcutsService: ShortcutsService,
  ) {}

  @TypedRoute.Get('/')
  async getShortcuts(
    // @TypedQuery() userId: string & tags.Format<'uuid'>,
    @TypedQuery() query: Pick<IShortcuts, 'userId'>,
  ): Promise<IResponse<IShortcuts>> {
    this.logger.debug(`[${this.getShortcuts.name}]`, query);

    const user = await this.userService.findUser({ id: query.userId });

    if (!user) throw new EntityNotfoundException({ message: 'user not found' });

    const shortcuts = await this.shortcutsService.findShortcuts({
      userId: query.userId,
    });

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
  async updateShortcuts(
    @TypedBody() dto: IShortcutsUpdate,
  ): Promise<IResponse<IShortcuts>> {
    this.logger.debug(`[updateShortcuts] Body: `, dto);

    const user = await this.userService.findUser({ id: dto.userId });

    if (!user) throw new EntityNotfoundException({ message: 'user not found' });

    const updated = await this.shortcutsService.updateShortcuts(dto);

    return {
      status: 'success',
      data: updated,
    };
  }
}
