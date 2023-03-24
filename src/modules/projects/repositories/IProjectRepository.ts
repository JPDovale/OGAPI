import { type IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'

import { type ICreateProjectDTO } from '../dtos/ICreateProjectDTO'
import { type IPlotProject } from '../infra/mongoose/entities/Plot'
import {
  type IProjectMongo,
  type ISharedWhitUsers,
} from '../infra/mongoose/entities/Project'
import { type IUpdateName } from '../infra/mongoose/repositories/types/IUpdateName'

export interface IProjectsRepository {
  create: (
    dataProjectObj: ICreateProjectDTO,
  ) => Promise<IProjectMongo | null | undefined>
  listPerUser: (userId: string) => Promise<IProjectMongo[]>
  findById: (projectId: string) => Promise<IProjectMongo | null | undefined>
  addUsers: (
    users: ISharedWhitUsers[],
    projectId: string,
  ) => Promise<IProjectMongo | null | undefined>
  updateImage: (
    image: IAvatar,
    projectId: string,
  ) => Promise<IProjectMongo | null | undefined>
  delete: (projectId: string) => Promise<void>
  updatePlot: (
    projectId: string,
    plot: IPlotProject,
  ) => Promise<IProjectMongo | null | undefined>
  deletePerUserId: (userId: string) => Promise<void>
  listAll: () => Promise<IProjectMongo[]>
  updateName: ({
    id,
    name,
  }: IUpdateName) => Promise<IProjectMongo | null | undefined>
  removeTagsInAllProjects: () => Promise<void>
}
