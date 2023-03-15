import { type ICreateBoxDTO } from '@modules/boxes/dtos/ICrateBoxDTO'

import { type IBox } from '../entities/types/IBox'
import { type IAddArchive } from './types/IAddArchive'
import { type IFindByNameAndProjectId } from './types/IFindByNameAndProjectId'
import { type IUpdateArchives } from './types/IUpdateArchives'

export interface IBoxesRepository {
  create: (box: ICreateBoxDTO) => Promise<IBox | null | undefined>
  createMany: (boxes: ICreateBoxDTO[]) => Promise<void>
  deletePerProjectId: (projectId: string) => Promise<void>
  findByUserId: (userId: string) => Promise<IBox[]>
  findPerProjectIds: (projectIds: string[]) => Promise<IBox[]>
  findByNameAndProjectId: ({
    name,
    projectId,
  }: IFindByNameAndProjectId) => Promise<IBox | null | undefined>
  addArchive: ({ archive, id }: IAddArchive) => Promise<IBox | null | undefined>

  updateArchives: ({
    archives,
    id,
  }: IUpdateArchives) => Promise<IBox | null | undefined>

  listPerUser: (userId: string) => Promise<IBox[]>

  numberOfBoxesByUserId: (userId: string) => Promise<number>
  findNotInternalPerUserId: (userId: string) => Promise<IBox[]>
  numberOfBoxesNotInternalByUserId: (userId: string) => Promise<number>
  findById: (boxId: string) => Promise<IBox | null | undefined>
}
