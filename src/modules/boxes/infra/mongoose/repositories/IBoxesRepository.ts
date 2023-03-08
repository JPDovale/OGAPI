import { ICreateBoxDTO } from '@modules/boxes/dtos/ICrateBoxDTO'

import { IBox } from '../entities/types/IBox'
import { IAddArchive } from './types/IAddArchive'
import { IFindByNameAndProjectId } from './types/IFindByNameAndProjectId'
import { IUpdateArchives } from './types/IUpdateArchives'

export interface IBoxesRepository {
  create: (box: ICreateBoxDTO) => Promise<IBox>
  createMany: (boxes: ICreateBoxDTO[]) => Promise<void>
  deletePerProjectId: (projectId: string) => Promise<void>
  findByUserId: (userId: string) => Promise<IBox[]>
  findPerProjectIds: (projectIds: string[]) => Promise<IBox[]>
  findByNameAndProjectId: ({
    name,
    projectId,
  }: IFindByNameAndProjectId) => Promise<IBox>
  addArchive: ({ archive, id }: IAddArchive) => Promise<IBox>

  updateArchives: ({ archives, id }: IUpdateArchives) => Promise<IBox>
}
