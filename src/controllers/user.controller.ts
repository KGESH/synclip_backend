import { Controller, Logger } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import {
  IUser,
  IUserCreate,
  IUserQuery,
  IUserResponse,
  IUserUpdate,
} from '../dtos/user.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @TypedRoute.Get('/')
  async getUser(@TypedQuery() query: IUserQuery): Promise<IUserResponse> {
    const { id, email } = query;

    if (!email && !id) {
      return { status: 'error', message: 'id or email is required' };
    }

    try {
      if (id) {
        const user = await this.userService.findUserById({ id });

        if (!user) return { status: 'not_found', message: 'user not found' };

        return { status: 'success', data: user };
      }

      if (email) {
        const user = await this.userService.findUserByEmail({ email });

        if (!user) return { status: 'not_found', message: 'user not found' };

        return { status: 'success', data: user };
      }

      return { status: 'error', message: 'Unknown error' };
    } catch (e) {
      this.logger.error(e);
      return { status: 'error', message: 'Unknown error' };
    }
  }

  @TypedRoute.Post('/')
  async createUser(@TypedBody() dto: IUserCreate): Promise<IUserResponse> {
    return await this.userService.createUser(dto);
  }

  @TypedRoute.Patch('/')
  async updateUser(@TypedBody() dto: IUserUpdate): Promise<IUserResponse> {
    try {
      const found = await this.userService.findUserById({ id: dto.id });

      if (!found) return { status: 'not_found', message: 'user not found' };

      const updated = await this.userService.updateUser(dto);

      return {
        status: 'success',
        data: updated,
      };
    } catch (e) {
      this.logger.error(e);
      return {
        status: 'error',
        message: 'Unknown error',
      };
    }
  }
}
