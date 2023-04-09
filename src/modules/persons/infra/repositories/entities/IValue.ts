import { type Value } from '@prisma/client'

import { type IException } from './IException'

export interface IValue extends Value {
  exceptions?: IException[]
}
