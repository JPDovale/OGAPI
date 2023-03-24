import { v4 as uuidV4 } from 'uuid'

import { type IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { type ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { type IAppearance } from '@modules/persons/infra/mongoose/entities/Appearance'
import { type ICouple } from '@modules/persons/infra/mongoose/entities/Couple'
import { type IDream } from '@modules/persons/infra/mongoose/entities/Dream'
import { type IFear } from '@modules/persons/infra/mongoose/entities/Fear'
import { type IObjective } from '@modules/persons/infra/mongoose/entities/Objective'
import {
  type IPersonMongo,
  PersonMongo,
} from '@modules/persons/infra/mongoose/entities/Person'
import { type IPersonality } from '@modules/persons/infra/mongoose/entities/Personality'
import { type IPower } from '@modules/persons/infra/mongoose/entities/Power'
import { type ITrauma } from '@modules/persons/infra/mongoose/entities/Trauma'
import { type IValue } from '@modules/persons/infra/mongoose/entities/Value'
import { type IWishe } from '@modules/persons/infra/mongoose/entities/Wishe'
import { type IComment } from '@modules/projects/infra/mongoose/entities/Comment'

import { type IPersonsRepository } from '../IPersonsRepository'

export class PersonsRepositoryInMemory implements IPersonsRepository {
  persons: IPersonMongo[] = []

  async create(
    userId: string,
    projectId: string,
    person: ICreatePersonDTO,
  ): Promise<IPersonMongo | null | undefined> {
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
