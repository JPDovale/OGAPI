export interface IStorageProvider {
  upload: (file: Express.Multer.File, toFolder: 'avatar') => Promise<string>
  delete: (filename: string, toFolder: 'avatar') => Promise<void>
}
