import { Injectable, Logger } from '@nestjs/common';
import { IUser, IUserCreate, IUserQuery } from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';
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

  async createUser(dto: IUserCreate): Promise<IUser> {
    return await this.userRepository.create(dto);
  }

  async updateUser(dto: Partial<IUser>) {
    return await this.userRepository.update(dto);
  }
}
