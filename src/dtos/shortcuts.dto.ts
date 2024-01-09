import { tags } from 'typia';

export type IShortcutsSchema = {
  copy: string;
};

export type IShortcuts = {
  id: string & tags.Format<'uuid'>;
  userId: string & tags.Format<'uuid'>;
  shortcuts: IShortcutsSchema;
};

export type IShortcutsCreate = Omit<IShortcuts, 'id'>;

export type IShortcutsUpdate = Pick<IShortcuts, 'userId'> &
  Partial<Omit<IShortcuts, 'id'>>;
