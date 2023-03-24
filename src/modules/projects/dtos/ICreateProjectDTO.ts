import { type IPlotProject } from '../infra/mongoose/entities/Plot'
import { type ISharedWhitUsers } from '../infra/mongoose/entities/Project'

export interface ICreateProjectDTO {
  name: string
  createdPerUser: string
  users: ISharedWhitUsers[]
  type: 'book' | 'rpg' | 'roadMap' | 'gameplay'
  private: boolean
  password?: string
  plot: IPlotProject
}
