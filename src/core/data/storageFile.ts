export class StorageFile
{
  public url: string | null = null;
  public base64File: string | null = null;
  public extension: string | null = null;
  public contentType: string | null = null;
  public status: StorageFileStatus = StorageFileStatus.Unchanged;

  constructor(init?: Partial<StorageFile>)
  {
    Object.assign(this, init);
  }
}

export const StorageFileStatus = { Unchanged: 0, New: 1, Delete: 2 } as const;

export type StorageFileStatus = typeof StorageFileStatus[keyof typeof StorageFileStatus];
