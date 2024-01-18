import * as typia from 'typia';
import { IUser, IUserCreate, IUserUpdate } from '../../../src/dtos/user.dto';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export class MockUserHelper {
  static randomId = uuidv4;
  static dto = typia.createRandom<IUser>();
  static createDto = typia.createRandom<IUserCreate>();
  static updateDto = typia.createRandom<IUserUpdate>();
  static entity = typia.createRandom<User>();
}
