import { IArchive } from './IArchive'

export interface IBox {
  id: string
  name: string
  internal: boolean
  type?: string
  tags: Array<{
    name: string
  }>
  archives: IArchive[]
  createdAt: string
  updatedAt: string
}
