import { ICreateProjectDTO } from '../dtos/ICreateProjectDTO'
import { IProjectMongo } from '../infra/mongoose/entities/Project'

export interface IProjectsRepository {
  create: (dataProjectObj: ICreateProjectDTO) => Promise<IProjectMongo>
}
