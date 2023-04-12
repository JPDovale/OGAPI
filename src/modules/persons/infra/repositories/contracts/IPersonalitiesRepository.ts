import { type ICreatePersonalityDTO } from '@modules/persons/dtos/ICreatePersonalityDTO'
import { type IUpdatePersonalityDTO } from '@modules/persons/dtos/IUpdatePersonalityDTO'

import { type IPersonality } from '../entities/IPersonality'
import { type IAddOnePersonInObject } from '../types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../types/IRemoveOnePersonById'

export abstract class IPersonalitiesRepository {
  abstract create(data: ICreatePersonalityDTO): Promise<IPersonality | null>
  abstract findById(personalityId: string): Promise<IPersonality | null>
  abstract delete(personalityId: string): Promise<void>
  abstract removeOnePersonById(data: IRemoveOnePersonById): Promise<void>
  abstract addPerson(data: IAddOnePersonInObject): Promise<void>
  abstract update(data: IUpdatePersonalityDTO): Promise<IPersonality | null>
}
