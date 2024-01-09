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
    this.logger.debug(`[getShortcuts] Param: `, userId);

    const user = await this.userService.findUser({
      id: userId,
    });

    if (!user) {
      return {
        status: 'error',
        message: 'user not found',
      };
    }

    const shortcuts = await this.shortcutsService.findShortcuts({
      userId,
    });

    if (!shortcuts) {
      return {
        status: 'not_found',
        message: 'shortcuts not found',
      };
    }

    return {
      status: 'success',
      data: shortcuts,
    };
  }

  @TypedRoute.Post('/')
  async createShortcuts(
    @TypedBody() dto: IShortcutsCreate,
  ): Promise<IResponse<IShortcuts>> {
    this.logger.debug(`[createShortcuts] Body: `, dto);

    if (!dto.userId) {
      return {
        status: 'error',
        message: 'userId is required',
      };
    }

    const user = await this.userService.findUser({
      id: dto.userId,
    });

    if (!user) {
      return {
        status: 'error',
        message: 'user not found',
      };
    }

    return this.shortcutsService.createShortcuts(dto);
  }

  @TypedRoute.Patch('/')
  async updateShortcuts(@TypedBody() dto: IShortcutsUpdate) {
    this.logger.debug(`[updateShortcuts] Body: `, dto);

    if (!dto.userId) {
      return {
        status: 'error',
        message: 'userId is required',
      };
    }

    const user = await this.userService.findUser({
      id: dto.userId,
    });

    if (!user) {
      return {
        status: 'error',
        message: 'user not found',
      };
    }

    return this.shortcutsService.updateShortcuts(dto);
  }
}
