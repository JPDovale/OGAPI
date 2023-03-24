import { type IArchive } from '../infra/mongoose/entities/types/IArchive'

export interface ICreateBoxDTO {
  name: string
  description?: string
  userId: string
  projectId?: string
  internal: boolean
  type?: string
  tags: Array<{
    name: string
  }>
  archives?: IArchive[]
}
