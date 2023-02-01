import { IBook } from '../entities/types/IBook'
import { ICreateBook } from './types/ICreateBook'
import { IFindManyById } from './types/IFindManyById'

export interface IBooksRepository {
  create: ({ projectId, book }: ICreateBook) => Promise<IBook>
  findManyById: ({ ids }: IFindManyById) => Promise<IBook[]>
}
