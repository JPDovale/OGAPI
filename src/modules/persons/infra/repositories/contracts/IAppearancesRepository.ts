import { type ICreateAppearanceDTO } from '@modules/persons/dtos/ICreateAppearanceDTO'
import { type IUpdateAppearanceDTO } from '@modules/persons/dtos/IUpdateAppearanceDTO'

import { type IAppearance } from '../entities/IAppearance'
import { type IAddOnePersonInObject } from '../types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../types/IRemoveOnePersonById'

export abstract class IAppearancesRepository {
  abstract create(
    data: ICreateAppearanceDTO,
    personId: string,
  ): Promise<IAppearance | null>
  abstract findById(appearanceId: string): Promise<IAppearance | null>
  abstract delete(appearanceId: string): Promise<void>
  abstract removeOnePersonById(data: IRemoveOnePersonById): Promise<void>
  abstract addPerson(data: IAddOnePersonInObject): Promise<void>
  abstract update(data: IUpdateAppearanceDTO): Promise<IAppearance | null>
  abstract listPerPersons(personsIds: string[]): Promise<IAppearance[]>
}
