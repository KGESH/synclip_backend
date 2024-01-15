import { Controller, Logger } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import { IUser, IUserCreate, IUserQuery, IUserUpdate } from '../dtos/user.dto';
import { IResponse } from '../dtos/response.dto';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';
import { RequiredArgsException } from '../exceptions/requiredArgs.exception';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @TypedRoute.Get('/')
  async getUser(@TypedQuery() query: IUserQuery): Promise<IResponse<IUser>> {
    const { id, email } = query;

    this.logger.log(`[${this.getUser.name}]`, query);

    if (!email && !id)
      throw new RequiredArgsException({ message: 'id or email is required' });

    const user = await this.userService.findUser(query);

    if (!user) throw new EntityNotfoundException({ message: 'user not found' });

    this.logger.log(`[${this.getUser.name}]`, user);

    return { status: 'success', data: user };
  }

  @TypedRoute.Post('/')
  async createUser(@TypedBody() dto: IUserCreate): Promise<IResponse<IUser>> {
    this.logger.log(`[${this.createUser.name}]`, dto);
    const user = await this.userService.createUser(dto);

    this.logger.log(`[${this.createUser.name}]`, user);

    return {
      status: 'success',
      data: user,
    };
  }

  @TypedRoute.Patch('/')
  async updateUser(@TypedBody() dto: IUserUpdate): Promise<IResponse<IUser>> {
    const updated = await this.userService.updateUser(dto);

    return {
      status: 'success',
      data: updated,
    };
  }
}
