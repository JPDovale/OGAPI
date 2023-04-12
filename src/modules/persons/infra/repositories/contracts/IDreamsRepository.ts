import { type ICreateDreamDTO } from '@modules/persons/dtos/ICreateDreamDTO'
import { type IUpdateDreamDTO } from '@modules/persons/dtos/IUpdateDreamDTO'

import { type IDream } from '../entities/IDream'
import { type IAddOnePersonInObject } from '../types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../types/IRemoveOnePersonById'

export abstract class IDreamsRepository {
  abstract create(data: ICreateDreamDTO): Promise<IDream | null>
  abstract findById(dreamId: string): Promise<IDream | null>
  abstract delete(dreamId: string): Promise<void>
  abstract removeOnePersonById(data: IRemoveOnePersonById): Promise<void>
  abstract addPerson(data: IAddOnePersonInObject): Promise<void>
  abstract update(data: IUpdateDreamDTO): Promise<IDream | null>
}
