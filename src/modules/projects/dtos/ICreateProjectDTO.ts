import { IPlotProject } from '../infra/mongoose/entities/Plot'
import { ISharedWhitUsers } from '../infra/mongoose/entities/Project'

export interface ICreateProjectDTO {
  name: string
  createdPerUser: string
  users: ISharedWhitUsers[]
  type: 'book' | 'rpg' | 'roadMap' | 'gameplay'
  private: boolean
  password?: string
  plot: IPlotProject
}
