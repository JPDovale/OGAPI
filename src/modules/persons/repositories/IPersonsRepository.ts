import { type IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { type IComment } from '@modules/projects/infra/mongoose/entities/Comment'

import { type ICreatePersonDTO } from '../dtos/ICreatePersonDTO'
import { type IAppearance } from '../infra/mongoose/entities/Appearance'
import { type ICouple } from '../infra/mongoose/entities/Couple'
import { type IDream } from '../infra/mongoose/entities/Dream'
import { type IFear } from '../infra/mongoose/entities/Fear'
import { type IObjective } from '../infra/mongoose/entities/Objective'
import { type IPersonMongo } from '../infra/mongoose/entities/Person'
import { type IPersonality } from '../infra/mongoose/entities/Personality'
import { type IPower } from '../infra/mongoose/entities/Power'
import { type ITrauma } from '../infra/mongoose/entities/Trauma'
import { type IValue } from '../infra/mongoose/entities/Value'
import { type IWishe } from '../infra/mongoose/entities/Wishe'

export interface IPersonsRepository {
  create: (
    userId: string,
    projectId: string,
    person: ICreatePersonDTO,
  ) => Promise<IPersonMongo | null | undefined>
  findById: (personId: string) => Promise<IPersonMongo | null | undefined>
  updateObjectives: (
    personId: string,
    objectives: IObjective[],
  ) => Promise<IPersonMongo | null | undefined>
  getAllPerUser: (userId: string) => Promise<IPersonMongo[]>
  updatePerson: (
    personId: string,
    person: ICreatePersonDTO,
  ) => Promise<IPersonMongo | null | undefined>
  deleteById: (personId: string) => Promise<void>
  updatePersonality: (
    personId: string,
    personality: IPersonality[],
  ) => Promise<IPersonMongo | null | undefined>
  updateValues: (
    personId: string,
    values: IValue[],
  ) => Promise<IPersonMongo | null | undefined>
  updateDreams: (
    personId: string,
    dreams: IDream[],
  ) => Promise<IPersonMongo | null | undefined>
  updateFears: (
    personId: string,
    dreams: IFear[],
  ) => Promise<IPersonMongo | null | undefined>
  updateWishes: (
    personId: string,
    dreams: IWishe[],
  ) => Promise<IPersonMongo | null | undefined>
  updateImage: (
    image: IAvatar,
    personId: string,
  ) => Promise<IPersonMongo | null | undefined>
  updateCommentsPerson: (
    personId: string,
    comments: IComment[],
  ) => Promise<IPersonMongo | null | undefined>
  getPersonsPerProject: (projectId: string) => Promise<IPersonMongo[]>
  updateAppearance: (
    personId: string,
    appearance: IAppearance[],
  ) => Promise<IPersonMongo | null | undefined>
  updateTraumas: (
    personId: string,
    traumas: ITrauma[],
  ) => Promise<IPersonMongo | null | undefined>
  updatePowers: (
    personId: string,
    powers: IPower[],
  ) => Promise<IPersonMongo | null | undefined>
  updateCouples: (
    personId: string,
    powers: ICouple[],
  ) => Promise<IPersonMongo | null | undefined>
  deletePerUserId: (userId: string) => Promise<void>
  deletePerProjectId: (projectId: string) => Promise<void>
  findManyById: (ids: string[]) => Promise<IPersonMongo[]>
  listPerUser: (userId: string) => Promise<IPersonMongo[]>
  findByProjectIds: (projectIds: string[]) => Promise<IPersonMongo[]>
  getNumberOfPersonsByProjectId: (projectId: string) => Promise<number>
}
