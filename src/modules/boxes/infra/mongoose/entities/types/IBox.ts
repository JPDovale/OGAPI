import { type IArchive } from './IArchive'

export interface IBox {
  id: string
  name: string
  description: string
  projectId: string
  userId: string
  internal: boolean
  type: string
  tags: Array<{
    name: string
  }>
  archives: IArchive[]
  createdAt: string
  updatedAt: string
}
