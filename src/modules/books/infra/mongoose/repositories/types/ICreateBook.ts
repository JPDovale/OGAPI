import { ICreateBookDTO } from '@modules/books/dtos/ICreateBookDTO'

export interface ICreateBook {
  projectId: string
  book: ICreateBookDTO
}
