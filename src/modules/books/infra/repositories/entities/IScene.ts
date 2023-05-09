import { type IPerson } from '@modules/persons/infra/repositories/entities/IPerson'
import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'
import { type Scene } from '@prisma/client'

export interface IScene extends Scene {
  persons?: IPerson[]
  comments?: IComment[]
}
