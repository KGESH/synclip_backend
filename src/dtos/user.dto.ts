import { tags } from 'typia';

export type IUser = {
  id: string & tags.Format<'uuid'>;
  nickname: string & tags.MinLength<1> & tags.MaxLength<50>;
  email: string & tags.Format<'email'>;
};

export type IUserCreate = Omit<IUser, 'id'>;

export type IUserUpdate = Pick<IUser, 'id'> & Partial<IUser>;

export type IUserQuery = Partial<Pick<IUser, 'id' | 'email'>>;
