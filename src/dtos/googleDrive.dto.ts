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
