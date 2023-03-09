import { IArchive } from '../infra/mongoose/entities/types/IArchive'

export interface ICreateBoxDTO {
  name: string
  userId: string
  projectId?: string
  internal?: boolean
  type?: string
  tags: Array<{
    name: string
  }>
  archives?: IArchive[]
}
