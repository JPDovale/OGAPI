import { IBook } from '../entities/types/IBook'
import { ICreateBook } from './types/ICreateBook'
import { IFindManyById } from './types/IFindManyById'
import { IUpdateCapitules } from './types/IUpdateCapitules'
import { IUpdateFrontCover } from './types/IUpdateFrontCover'

export interface IBooksRepository {
  create: ({ projectId, book }: ICreateBook) => Promise<IBook>
  findManyById: ({ ids }: IFindManyById) => Promise<IBook[]>
  findById: (id: string) => Promise<IBook>
  updateFrontCover: ({ id, frontCover }: IUpdateFrontCover) => Promise<IBook>
  updateCapitules: ({ id, capitules }: IUpdateCapitules) => Promise<IBook>
}
