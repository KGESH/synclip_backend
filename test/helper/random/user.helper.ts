import * as typia from 'typia';
import { IUser, IUserCreate, IUserUpdate } from '../../../src/dtos/user.dto';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const createRandomUserId = uuidv4;

export const createRandomUserDto = typia.createRandom<IUser>();

export const createRandomCreateUserDto = typia.createRandom<IUserCreate>();

export const createRandomUpdateUserDto = typia.createRandom<IUserUpdate>();

export const createRandomUserEntity = typia.createRandom<User>();
