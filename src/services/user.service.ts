import { Injectable, Logger } from '@nestjs/common';
import { IUser, IUserCreate, IUserQuery } from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { RequiredArgsException } from '../exceptions/requiredArgs.exception';
import { EntityConflictException } from '../exceptions/entityConflict.exception';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';

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
    const found = await this.userRepository.findBy({ email: dto.email });

    if (found)
      throw new EntityConflictException({ message: 'user already exists' });

    return await this.userRepository.create(dto);
  }

  async updateUser(dto: Partial<IUser>): Promise<IUser> {
    const found = await this.findUser({ id: dto.id });

    if (!found)
      throw new EntityNotfoundException({ message: 'user not found' });

    return await this.userRepository.update(dto);
  }
}
