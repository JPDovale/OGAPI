import { ICreatePersonDTO } from '../dtos/ICreatePersonDTO'
import { IDream } from '../infra/mongoose/entities/Dream'
import { IFear } from '../infra/mongoose/entities/Fear'
import { IObjective } from '../infra/mongoose/entities/Objective'
import { IPersonMongo } from '../infra/mongoose/entities/Person'
import { IPersonality } from '../infra/mongoose/entities/Personality'
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
  updateImage: (url: string, personId: string) => Promise<void>
}
