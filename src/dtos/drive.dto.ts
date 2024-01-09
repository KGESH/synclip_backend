import { tags } from 'typia';
import { IUser } from './user.dto';

export type IDrive = {
  id: string & tags.Format<'uuid'>;
  userId: string & tags.Format<'uuid'>;
  baseFolderId: string;
  textFolderId: string;
  fileFolderId: string;
};

export type IDriveCreate = Omit<IDrive, 'id'>;

export type IDriveUpdate = Pick<IDrive, 'userId'> & Partial<Omit<IDrive, 'id'>>;

export type IDriveFoldersQuery = Partial<Pick<IUser, 'id' | 'email'>>;

export type IFile = {
  id: string;
  name: string;
};

export type ITextUpload = {
  type: 'text';
  content: IFile;
};

export type IBinaryFIleUpload = {
  type: 'file';
  contents: IFile | IFile[];
};
