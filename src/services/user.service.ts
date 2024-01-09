import { Injectable, Logger } from '@nestjs/common';
import {
  IUser,
  IUserCreate,
  IUserQuery,
  IUserResponse,
} from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async findUser({ id, email }: IUserQuery): Promise<IUser | null> {
    if (id) return await this.userRepository.findBy({ id });
    return await this.userRepository.findBy({ email });
  }

  async createUser(dto: IUserCreate): Promise<IUserResponse> {
    try {
      const user = await this.userRepository.create(dto);

      return {
        status: 'success',
        data: user,
      };
    } catch (e) {
      this.logger.error(e);
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return {
            status: 'error',
            message: 'Email already exists',
          };
        }
      }
      return {
        status: 'error',
        message: 'Unknown error',
      };
    }
  }

  async updateUser(dto: Partial<IUser>) {
    return this.userRepository.update(dto);
  }
}
