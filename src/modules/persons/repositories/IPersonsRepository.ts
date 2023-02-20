import { IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { IComment } from '@modules/projects/infra/mongoose/entities/Comment'

import { ICreatePersonDTO } from '../dtos/ICreatePersonDTO'
import { IAppearance } from '../infra/mongoose/entities/Appearance'
import { ICouple } from '../infra/mongoose/entities/Couple'
import { IDream } from '../infra/mongoose/entities/Dream'
import { IFear } from '../infra/mongoose/entities/Fear'
import { IObjective } from '../infra/mongoose/entities/Objective'
import { IPersonMongo } from '../infra/mongoose/entities/Person'
import { IPersonality } from '../infra/mongoose/entities/Personality'
import { IPower } from '../infra/mongoose/entities/Power'
import { ITrauma } from '../infra/mongoose/entities/Trauma'
import { IValue } from '../infra/mongoose/entities/Value'
import { IWishe } from '../infra/mongoose/entities/Wishe'

export interface IPersonsRepository {
  create: (
    userId: string,
    projectId: string,
    person: ICreatePersonDTO,
  ) => Promise<IPersonMongo>
  findById: (personId: string) => Promise<IPersonMongo>
  updateObjectives: (
    personId: string,
    objectives: IObjective[],
  ) => Promise<IPersonMongo>
  getAllPerUser: (userId: string) => Promise<IPersonMongo[]>
  updatePerson: (
    personId: string,
    person: ICreatePersonDTO,
  ) => Promise<IPersonMongo>
  deleteById: (personId: string) => Promise<void>
  updatePersonality: (
    personId: string,
    personality: IPersonality[],
  ) => Promise<IPersonMongo>
  updateValues: (personId: string, values: IValue[]) => Promise<IPersonMongo>
  updateDreams: (personId: string, dreams: IDream[]) => Promise<IPersonMongo>
  updateFears: (personId: string, dreams: IFear[]) => Promise<IPersonMongo>
  updateWishes: (personId: string, dreams: IWishe[]) => Promise<IPersonMongo>
  updateImage: (image: IAvatar, personId: string) => Promise<IPersonMongo>
  updateCommentsPerson: (
    personId: string,
    comments: IComment[],
  ) => Promise<IPersonMongo>
  getPersonsPerProject: (projectId: string) => Promise<IPersonMongo[]>
  updateAppearance: (
    personId: string,
    appearance: IAppearance[],
  ) => Promise<IPersonMongo>
  updateTraumas: (personId: string, traumas: ITrauma[]) => Promise<IPersonMongo>
  updatePowers: (personId: string, powers: IPower[]) => Promise<IPersonMongo>
  updateCouples: (personId: string, powers: ICouple[]) => Promise<IPersonMongo>
  deletePerUserId: (userId: string) => Promise<void>
  deletePerProjectId: (projectId: string) => Promise<void>
  findManyById: (ids: string[]) => Promise<IPersonMongo[]>
  listPerUser: (userId: string) => Promise<IPersonMongo[]>
}
