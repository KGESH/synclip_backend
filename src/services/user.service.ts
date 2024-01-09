import { Injectable, Logger } from '@nestjs/common';
import { IUser, IUserCreate, IUserQuery } from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { Prisma } from '@prisma/client';
import { IResponse } from '../dtos/response.dto';
import { PRISMA_UNIQUE_CONSTRAINT_FAILED } from '../constants/prisma.constant';
import { EntityConflictException } from '../exceptions/entityConflict.exception';
import { UnknownException } from '../exceptions/unknown.exception';
import { RequiredArgsException } from '../exceptions/requiredArgs.exception';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async findUser({ id, email }: IUserQuery): Promise<IUser | null> {
    if (!id && !email) {
      throw new RequiredArgsException({
        message: 'id(User ID) or email is required',
      });
    }

    if (id) return await this.userRepository.findBy({ id });

    return await this.userRepository.findBy({ email });
  }

  async createUser(dto: IUserCreate): Promise<IResponse<IUser>> {
    try {
      const user = await this.userRepository.create(dto);

      return {
        status: 'success',
        data: user,
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PRISMA_UNIQUE_CONSTRAINT_FAILED) {
          throw new EntityConflictException({
            message: 'Email already exists',
          });
        }
      }

      throw new UnknownException(e);
    }
  }

  async updateUser(dto: Partial<IUser>) {
    try {
      return this.userRepository.update(dto);
    } catch (e) {
      throw new UnknownException(e);
    }
  }
}
