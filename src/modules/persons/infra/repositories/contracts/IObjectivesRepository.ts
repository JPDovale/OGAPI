import { type ICreateObjectiveDTO } from '@modules/persons/dtos/ICreateObjectiveDTO'
import { type IUpdateObjectiveDTO } from '@modules/persons/dtos/IUpdateObjectiveDTO'

import { type IObjective } from '../entities/IObjective'
import { type IAddOnePersonInObject } from '../types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../types/IRemoveOnePersonById'

export abstract class IObjectivesRepository {
  abstract create(
    data: ICreateObjectiveDTO,
    personId: string,
  ): Promise<IObjective | null>
  abstract findById(objectiveId: string): Promise<IObjective | null>
  abstract delete(objectiveId: string): Promise<void>
  abstract removeOnePersonById(data: IRemoveOnePersonById): Promise<void>
  abstract addPerson(data: IAddOnePersonInObject): Promise<void>
  abstract update(data: IUpdateObjectiveDTO): Promise<IObjective | null>
  abstract listPerPersons(personIds: string[]): Promise<IObjective[]>
}
