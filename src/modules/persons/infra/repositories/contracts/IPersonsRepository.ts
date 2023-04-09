import { type IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { type ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'

import { type IAppearance } from '../entities/IAppearance'
import { type ICouple } from '../entities/ICouple'
import { type IDream } from '../entities/IDream'
import { type IFear } from '../entities/IFear'
import { type IObjective } from '../entities/IObjective'
import { type IPerson } from '../entities/IPerson'
import { type IPersonality } from '../entities/IPersonality'
import { type IPower } from '../entities/IPower'
import { type ITrauma } from '../entities/ITrauma'
import { type IValue } from '../entities/IValue'
import { type IWishe } from '../entities/IWishe'

export abstract class IPersonsRepository {
  abstract create(data: ICreatePersonDTO): Promise<IPerson | null>
  abstract findById(personId: string): Promise<IPerson | null>
  abstract updateObjectives(
    personId: string,
    objectives: IObjective[],
  ): Promise<IPerson | null>
  abstract getAllPerUser(userId: string): Promise<IPerson[]>
  abstract updatePerson(
    personId: string,
    person: ICreatePersonDTO,
  ): Promise<IPerson | null>
  abstract deleteById(personId: string): Promise<void>
  abstract updatePersonality(
    personId: string,
    personality: IPersonality[],
  ): Promise<IPerson | null>
  abstract updateValues(
    personId: string,
    values: IValue[],
  ): Promise<IPerson | null>
  abstract updateDreams(
    personId: string,
    dreams: IDream[],
  ): Promise<IPerson | null>
  abstract updateFears(
    personId: string,
    dreams: IFear[],
  ): Promise<IPerson | null>
  abstract updateWishes(
    personId: string,
    dreams: IWishe[],
  ): Promise<IPerson | null>
  abstract updateImage(
    image: IAvatar,
    personId: string,
  ): Promise<IPerson | null>
  abstract updateCommentsPerson(
    personId: string,
    comments: IComment[],
  ): Promise<IPerson | null>
  abstract getPersonsPerProject(projectId: string): Promise<IPerson[]>
  abstract updateAppearance(
    personId: string,
    appearance: IAppearance[],
  ): Promise<IPerson | null>
  abstract updateTraumas(
    personId: string,
    traumas: ITrauma[],
  ): Promise<IPerson | null>
  abstract updatePowers(
    personId: string,
    powers: IPower[],
  ): Promise<IPerson | null>
  abstract updateCouples(
    personId: string,
    powers: ICouple[],
  ): Promise<IPerson | null>
  abstract deletePerUserId(userId: string): Promise<void>
  abstract deletePerProjectId(projectId: string): Promise<void>
  abstract findManyById(ids: string[]): Promise<IPerson[]>
  abstract listPerUser(userId: string): Promise<IPerson[]>
  abstract findByProjectIds(projectIds: string[]): Promise<IPerson[]>
  abstract getNumberOfPersonsByProjectId(projectId: string): Promise<number>
  abstract listAll(): Promise<IPerson[]>
}
