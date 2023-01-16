import { inject, injectable } from 'tsyringe'
import { v4 as uuidV4 } from 'uuid'

import { IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IComment } from '@modules/projects/infra/mongoose/entities/Comment'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'

import { IAppearance } from '../entities/Appearance'
import { ICouple } from '../entities/Couple'
import { IDream } from '../entities/Dream'
import { IFear } from '../entities/Fear'
import { Objective } from '../entities/Objective'
import { IPersonMongo, PersonMongo } from '../entities/Person'
import { IPersonality } from '../entities/Personality'
import { IPower } from '../entities/Power'
import { ITrauma } from '../entities/Trauma'
import { IValue } from '../entities/Value'
import { IWishe } from '../entities/Wishe'

@injectable()
export class PersonsMongoRepository implements IPersonsRepository {
  constructor(
    @inject('DateProvider') private readonly dateProvider: IDateProvider,
  ) {}

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
    })

    await newPerson.save()
    return newPerson
  }

  async findById(id: string): Promise<IPersonMongo> {
    const person = await PersonMongo.findOne({ id })
    return person
  }

  async updateObjectives(
    id: string,
    objectives: Objective[],
  ): Promise<IPersonMongo> {
    await PersonMongo.findOneAndUpdate(
      { id },
      { objectives, id, updateAt: this.dateProvider.getDate(new Date()) },
    )
    const updatedPerson = await PersonMongo.findOne({ id })
    return updatedPerson
  }

  async getAllPerUser(userId: string): Promise<IPersonMongo[]> {
    const allPersonsThisUser = await PersonMongo.find({ fromUser: userId })
    return allPersonsThisUser
  }

  async updatePerson(
    id: string,
    person: ICreatePersonDTO,
  ): Promise<IPersonMongo> {
    await PersonMongo.findOneAndUpdate(
      { id },
      {
        name: person.name,
        lastName: person.lastName,
        age: person.age,
        history: person.history,
        id,
        updateAt: this.dateProvider.getDate(new Date()),
      },
    )

    const updatedPerson = await PersonMongo.findOne({ id })
    return updatedPerson
  }

  async deleteById(id: string): Promise<void> {
    await PersonMongo.findOneAndDelete({ id })
  }

  async updatePersonality(
    id: string,
    personality: IPersonality[],
  ): Promise<IPersonMongo> {
    await PersonMongo.findOneAndUpdate(
      { id },
      { personality, id, updateAt: this.dateProvider.getDate(new Date()) },
    )
    const updatedPerson = await PersonMongo.findOne({ id })
    return updatedPerson
  }

  async updateValues(id: string, values: IValue[]): Promise<IPersonMongo> {
    await PersonMongo.findOneAndUpdate(
      { id },
      { values, id, updateAt: this.dateProvider.getDate(new Date()) },
    )
    const updatedPerson = await PersonMongo.findOne({ id })
    return updatedPerson
  }

  async updateDreams(id: string, dreams: IDream[]): Promise<IPersonMongo> {
    await PersonMongo.findOneAndUpdate(
      { id },
      { dreams, id, updateAt: this.dateProvider.getDate(new Date()) },
    )
    const updatedPerson = await PersonMongo.findOne({ id })
    return updatedPerson
  }

  async updateFears(id: string, fears: IFear[]): Promise<IPersonMongo> {
    await PersonMongo.findOneAndUpdate(
      { id },
      { fears, id, updateAt: this.dateProvider.getDate(new Date()) },
    )
    const updatedPerson = await PersonMongo.findOne({ id })
    return updatedPerson
  }

  async updateWishes(id: string, wishes: IWishe[]): Promise<IPersonMongo> {
    await PersonMongo.findOneAndUpdate(
      { id },
      { wishes, id, updateAt: this.dateProvider.getDate(new Date()) },
    )
    const updatedPerson = await PersonMongo.findOne({ id })
    return updatedPerson
  }

  async updateImage(image: IAvatar, id: string): Promise<IPersonMongo> {
    await PersonMongo.findOneAndUpdate(
      { id },
      { image, updateAt: this.dateProvider.getDate(new Date()) },
    )
    const updatedPerson = await PersonMongo.findOne({ id })
    return updatedPerson
  }

  async updateCommentsPerson(
    id: string,
    comments: IComment[],
  ): Promise<IPersonMongo> {
    await PersonMongo.findOneAndUpdate(
      { id },
      { comments, id, updateAt: this.dateProvider.getDate(new Date()) },
    )
    const updatedPerson = await PersonMongo.findOne({ id })
    return updatedPerson
  }

  async getPersonsPerProject(projectId: string): Promise<IPersonMongo[]> {
    const personsThisProject = await PersonMongo.find({
      defaultProject: projectId,
    })
    return personsThisProject
  }

  async updateAppearance(
    id: string,
    appearance: IAppearance[],
  ): Promise<IPersonMongo> {
    await PersonMongo.findOneAndUpdate(
      { id },
      { appearance, id, updateAt: this.dateProvider.getDate(new Date()) },
    )
    const updatedPerson = await PersonMongo.findOne({ id })
    return updatedPerson
  }

  async updateTraumas(id: string, traumas: ITrauma[]): Promise<IPersonMongo> {
    await PersonMongo.findOneAndUpdate(
      { id },
      { traumas, id, updateAt: this.dateProvider.getDate(new Date()) },
    )
    const updatedPerson = await PersonMongo.findOne({ id })
    return updatedPerson
  }

  async updatePowers(id: string, powers: IPower[]): Promise<IPersonMongo> {
    await PersonMongo.findOneAndUpdate(
      { id },
      { powers, id, updateAt: this.dateProvider.getDate(new Date()) },
    )
    const updatedPerson = await PersonMongo.findOne({ id })
    return updatedPerson
  }

  async updateCouples(id: string, couples: ICouple[]): Promise<IPersonMongo> {
    await PersonMongo.findOneAndUpdate(
      { id },
      { couples, id, updateAt: this.dateProvider.getDate(new Date()) },
    )
    const updatedPerson = await PersonMongo.findOne({ id })
    return updatedPerson
  }

  async deletePerUserId(userId: string): Promise<void> {
    await PersonMongo.deleteMany({ fromUser: userId })
  }

  async deletePerProjectId(projectId: string): Promise<void> {
    await PersonMongo.deleteMany({ defaultProject: projectId })
  }
}
