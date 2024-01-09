import { tags } from 'typia';

export type IShortcutsSchema = {
  copy: string;
};

export type IShortcuts = {
  id: string & tags.Format<'uuid'>;
  userId: string & tags.Format<'uuid'>;
  shortcuts: IShortcutsSchema;
  updatedAt: string;
};

export type IShortcutsCreate = Omit<IShortcuts, 'id' | 'updatedAt'>;

export type IShortQuery = Pick<IShortcuts, 'userId'>;

export type IShortcutsUpdate = Pick<IShortcuts, 'userId' | 'shortcuts'>;
