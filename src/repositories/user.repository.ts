import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { IUser, IUserCreate } from '../dtos/user.dto';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User, IUser> {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(user: User): IUser {
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
      return this._handlePrismaNotFoundError(e, `User not found.`);
    }
  }

  async findMany() {
    try {
      const users = await this.prisma.user.findMany();
      return users.map((user) => this._transform(user));
    } catch (e) {
      this._handlePrismaError(e);
    }
  }

  async create({ email, nickname }: IUserCreate) {
    try {
      const user = await this.prisma.user.create({
        data: {
          id: uuidv4(),
          email,
          nickname,
        },
      });

      return this._transform(user);
    } catch (e) {
      this._handlePrismaError(e, `User already exists.`);
    }
  }

  async update({ id, ...data }: Partial<IUser>) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
      });

      return this._transform(user);
    } catch (e) {
      this._handlePrismaError(e);
    }
  }
}
