import { type ITimeEvent } from '@modules/timelines/infra/repositories/entities/ITimeEvent'
import { type TimeEventBorn, type Person } from '@prisma/client'

import { type IAppearance } from './IAppearance'
import { type ICouple } from './ICouple'
import { type ICoupleWithPerson } from './ICoupleWithPerson'
import { type IDream } from './IDream'
import { type IFear } from './IFear'
import { type IObjective } from './IObjective'
import { type IPersonality } from './IPersonality'
import { type IPower } from './IPower'
import { type ITrauma } from './ITrauma'
import { type IValue } from './IValue'
import { type IWishe } from './IWishe'

export interface ITimeEventBorn extends TimeEventBorn {
  timeEvent?: ITimeEvent | null
}

export interface IPerson extends Person {
  appearances?: IAppearance[]
  objectives?: IObjective[]
  personalities?: IPersonality[]
  dreams?: IDream[]
  fears?: IFear[]
  powers?: IPower[]
  couples?: ICouple[]
  coupleWithPersons?: ICoupleWithPerson[]
  values?: IValue[]
  wishes?: IWishe[]
  traumas?: ITrauma[]
  timeEventBorn?: ITimeEventBorn | null
}
