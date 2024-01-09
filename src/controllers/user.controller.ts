import { Controller, Logger } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import { IUser, IUserCreate, IUserQuery, IUserUpdate } from '../dtos/user.dto';
import { IResponse } from '../dtos/response.dto';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @TypedRoute.Get('/')
  async getUser(@TypedQuery() query: IUserQuery): Promise<IResponse<IUser>> {
    const { id, email } = query;

    if (!email && !id)
      throw new EntityNotfoundException({ message: 'id or email is required' });

    const user = await this.userService.findUser(query);

    if (!user) throw new EntityNotfoundException({ message: 'user not found' });

    return { status: 'success', data: user };
  }

  @TypedRoute.Post('/')
  async createUser(@TypedBody() dto: IUserCreate): Promise<IResponse<IUser>> {
    const user = await this.userService.createUser(dto);

    return {
      status: 'success',
      data: user,
    };
  }

  @TypedRoute.Patch('/')
  async updateUser(@TypedBody() dto: IUserUpdate): Promise<IResponse<IUser>> {
    const found = await this.userService.findUser({ id: dto.id });

    if (!found)
      throw new EntityNotfoundException({ message: 'user not found' });

    const updated = await this.userService.updateUser(dto);

    return {
      status: 'success',
      data: updated,
    };
  }
}
