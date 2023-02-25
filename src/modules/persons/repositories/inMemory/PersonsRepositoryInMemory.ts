import { v4 as uuidV4 } from 'uuid'

import { IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { IAppearance } from '@modules/persons/infra/mongoose/entities/Appearance'
import { ICouple } from '@modules/persons/infra/mongoose/entities/Couple'
import { IDream } from '@modules/persons/infra/mongoose/entities/Dream'
import { IFear } from '@modules/persons/infra/mongoose/entities/Fear'
import { IObjective } from '@modules/persons/infra/mongoose/entities/Objective'
import {
  IPersonMongo,
  PersonMongo,
} from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonality } from '@modules/persons/infra/mongoose/entities/Personality'
import { IPower } from '@modules/persons/infra/mongoose/entities/Power'
import { ITrauma } from '@modules/persons/infra/mongoose/entities/Trauma'
import { IValue } from '@modules/persons/infra/mongoose/entities/Value'
import { IWishe } from '@modules/persons/infra/mongoose/entities/Wishe'
import { IComment } from '@modules/projects/infra/mongoose/entities/Comment'

import { IPersonsRepository } from '../IPersonsRepository'

export class PersonsRepositoryInMemory implements IPersonsRepository {
  persons: IPersonMongo[] = []

  async create(
    userId: string,
    projectId: string,
    person: ICreatePersonDTO,
  ): Promise<IPersonMongo> {
    const { age, history, lastName, name } = person

    const newPerson = new PersonMongo({
      id: uuidV4(),
      name,
      lastName,
      age,
      history,
      defaultProject: projectId,
      fromUser: userId,
      createAt: new Date(),
      updateAt: new Date(),
    })

    this.persons.push(newPerson)
    return newPerson
  }

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

  async deletePerUserId(userId: string): Promise<void> {
    const filteredPersons = this.persons.filter(
      (person) => person.fromUser !== userId,
    )

    this.persons = filteredPersons
  }

  async deletePerProjectId(projectId: string): Promise<void> {
    const filteredPersons = this.persons.filter(
      (person) => person.defaultProject !== projectId,
    )

    this.persons = filteredPersons
  }

  findManyById: (ids: string[]) => Promise<IPersonMongo[]>

  async listPerUser(userId: string): Promise<IPersonMongo[]> {
    const personOfUser = this.persons.filter(
      (person) => person.fromUser === userId,
    )

    return personOfUser
  }

  async findByProjectIds(projectIds: string[]): Promise<IPersonMongo[]> {
    const persons = this.persons.filter((person) => {
      const personIn = projectIds.find((id) => id === person.defaultProject)

      return !!personIn
    })

    return persons
  }
}
