import { IBook } from '../entities/types/IBook'
import { ICreateBook } from './types/ICreateBook'
import { IFindManyById } from './types/IFindManyById'
import { IUpdateCapitules } from './types/IUpdateCapitules'
import { IUpdateFrontCover } from './types/IUpdateFrontCover'
import { IUpdateGenres } from './types/IUpdateGenres'

export interface IBooksRepository {
  create: ({ projectId, book }: ICreateBook) => Promise<IBook>
  findManyById: ({ ids }: IFindManyById) => Promise<IBook[]>
  findById: (id: string) => Promise<IBook>
  updateFrontCover: ({ id, frontCover }: IUpdateFrontCover) => Promise<IBook>
  updateCapitules: ({
    id,
    capitules,
    writtenWords,
  }: IUpdateCapitules) => Promise<IBook>
  deletePerUserId: (id: string) => Promise<void>
  listPerUser: (userId: string) => Promise<IBook[]>
  deletePerProjectId: (projectId: string) => Promise<void>
  findByProjectIds: (projectIds: string[]) => Promise<IBook[]>
  updateGenres: ({ genres, id }: IUpdateGenres) => Promise<IBook>
}
