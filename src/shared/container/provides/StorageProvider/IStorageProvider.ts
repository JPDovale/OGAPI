export interface IStorageProvider {
  upload: (file: Express.Multer.File, toFolder: string) => Promise<string>
  delete: (filename: string, toFolder: string) => Promise<void>
}
