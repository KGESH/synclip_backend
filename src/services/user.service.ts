import { Injectable, Logger } from '@nestjs/common';
import { IUser, IUserCreate, IUserResponse } from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async findUserById({ id }: Pick<IUser, 'id'>): Promise<IUser | null> {
    return await this.userRepository.findBy({ id });
  }

  async findUserByEmail({
    email,
  }: Pick<IUser, 'email'>): Promise<IUser | null> {
    return this.userRepository.findBy({ email });
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
