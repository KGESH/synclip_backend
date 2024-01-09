import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { IUser, IUserCreate } from '../dtos/user.dto';
import { Prisma, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { PRISMA_ENTITY_NOT_FOUND } from '../constants/prisma.constant';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  private _transform(user: User): IUser {
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };
  }

  async findBy({
    id,
    email,
  }: Partial<Pick<IUser, 'id' | 'email'>>): Promise<IUser | null> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id,
          email,
        },
      });

      return this._transform(user);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // Not found
        if (e.code === PRISMA_ENTITY_NOT_FOUND) {
          return null;
        }
      }
      console.error(e);
      throw new Error(e);
    }
  }

  async findMany() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this._transform(user));
  }

  async create({ email, nickname }: IUserCreate) {
    const user = await this.prisma.user.create({
      data: {
        id: uuidv4(),
        email,
        nickname,
      },
    });

    return this._transform(user);
  }

  async update({ id, ...data }: Partial<IUser>) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this._transform(user);
  }
}
