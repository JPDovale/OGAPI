import { type IBook } from '../entities/types/IBook'
import { type ICreateBook } from './types/ICreateBook'
import { type IFindManyById } from './types/IFindManyById'
import { type IUpdateBook } from './types/IUpdateBook'
import { type IUpdateCapitules } from './types/IUpdateCapitules'
import { type IUpdateFrontCover } from './types/IUpdateFrontCover'
import { type IUpdateGenres } from './types/IUpdateGenres'

export interface IBooksRepository {
  create: ({
    projectId,
    book,
  }: ICreateBook) => Promise<IBook | null | undefined>
  findManyById: ({ ids }: IFindManyById) => Promise<IBook[]>
  findById: (id: string) => Promise<IBook | null | undefined>
  updateFrontCover: ({
    id,
    frontCover,
  }: IUpdateFrontCover) => Promise<IBook | null | undefined>
  updateCapitules: ({
    id,
    capitules,
    writtenWords,
  }: IUpdateCapitules) => Promise<IBook | null | undefined>
  deletePerUserId: (id: string) => Promise<void>
  listPerUser: (userId: string) => Promise<IBook[]>
  deletePerProjectId: (projectId: string) => Promise<void>
  findByProjectIds: (projectIds: string[]) => Promise<IBook[]>
  updateGenres: ({
    genres,
    id,
  }: IUpdateGenres) => Promise<IBook | null | undefined>
  updateBook: ({
    id,
    updatedInfos,
  }: IUpdateBook) => Promise<IBook | null | undefined>
  deletePerId: (id: string) => Promise<void>
}
