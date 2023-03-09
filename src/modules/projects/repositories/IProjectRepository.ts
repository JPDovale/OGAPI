import { IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'

import { ICreateProjectDTO } from '../dtos/ICreateProjectDTO'
import { IUpdatePlotDTO } from '../dtos/IUpdatePlotDTO'
import {
  IProjectMongo,
  ISharedWhitUsers,
} from '../infra/mongoose/entities/Project'
import { IUpdateName } from '../infra/mongoose/repositories/types/IUpdateName'

export interface IProjectsRepository {
  create: (dataProjectObj: ICreateProjectDTO) => Promise<IProjectMongo>
  listPerUser: (userId: string) => Promise<IProjectMongo[]>
  findById: (projectId: string) => Promise<IProjectMongo>
  addUsers: (
    users: ISharedWhitUsers[],
    projectId: string,
  ) => Promise<IProjectMongo>
  updateImage: (image: IAvatar, projectId: string) => Promise<IProjectMongo>
  delete: (projectId: string) => Promise<void>
  updatePlot: (
    projectId: string,
    plot: IUpdatePlotDTO,
  ) => Promise<IProjectMongo>
  deletePerUserId: (userId: string) => Promise<void>
  listAll: () => Promise<IProjectMongo[]>
  updateName: ({ id, name }: IUpdateName) => Promise<IProjectMongo>
  removeTagsInAllProjects: () => Promise<void>
}
