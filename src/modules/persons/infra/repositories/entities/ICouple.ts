import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'
import { type Couple } from '@prisma/client'

import { type ICoupleWithPerson } from './ICoupleWithPerson'

export interface ICouple extends Couple {
  coupleWithPerson?: ICoupleWithPerson
  comments?: IComment[]
}
