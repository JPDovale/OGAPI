import { ICreateProjectDTO } from '../dtos/ICreateProjectDTO'
import { IUpdatePlotDTO } from '../dtos/IUpdatePlotDTO'
import {
  IProjectMongo,
  ISharedWhitUsers,
} from '../infra/mongoose/entities/Project'
import { ITag } from '../infra/mongoose/entities/Tag'

export interface IProjectsRepository {
  create: (dataProjectObj: ICreateProjectDTO) => Promise<IProjectMongo>
  listPerUser: (userId: string) => Promise<IProjectMongo[]>
  findById: (projectId: string) => Promise<IProjectMongo>
  addUsers: (users: ISharedWhitUsers[], projectId: string) => Promise<void>
  updateImage: (url: string, projectId: string) => Promise<void>
  delete: (projectId: string) => Promise<void>
  updatePlot: (
    projectId: string,
    plot: IUpdatePlotDTO,
  ) => Promise<IProjectMongo>
  updateTag: (projectId: string, tags: ITag[]) => Promise<void>
}
