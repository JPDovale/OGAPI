import { type CoupleWithPerson } from '@prisma/client'

import { type IPerson } from './IPerson'

export interface ICoupleWithPerson extends CoupleWithPerson {
  person?: IPerson
}
