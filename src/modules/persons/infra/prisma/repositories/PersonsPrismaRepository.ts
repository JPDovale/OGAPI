import { type IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'
import {
  type Prisma,
  type Dream,
  type Fear,
  type Wishe,
  type Appearance,
  type Power,
} from '@prisma/client'
import { prisma } from '@shared/infra/database/createConnection'

import { type IPersonsRepository } from '../../repositories/contracts/IPersonsRepository'
import { type ICouple } from '../../repositories/entities/ICouple'
import { type IObjective } from '../../repositories/entities/IObjective'
import { type IPerson } from '../../repositories/entities/IPerson'
import { type IPersonality } from '../../repositories/entities/IPersonality'
import { type ITrauma } from '../../repositories/entities/ITrauma'
import { type IValue } from '../../repositories/entities/IValue'

export class PersonsPrismaRepository implements IPersonsRepository {
  async create(
    data: Prisma.PersonUncheckedCreateInput,
  ): Promise<IPerson | null> {
    const person = await prisma.person.create({
      data,
    })
    return person
  }

  async findById(personId: string): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async updateObjectives(
    personId: string,
    objectives: IObjective[],
  ): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async getAllPerUser(userId: string): Promise<IPerson[]> {
    throw new Error('Method not implemented.')
  }

  async updatePerson(
    personId: string,
    person: Prisma.PersonUncheckedCreateInput,
  ): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async deleteById(personId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async updatePersonality(
    personId: string,
    personality: IPersonality[],
  ): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async updateValues(
    personId: string,
    values: IValue[],
  ): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async updateDreams(
    personId: string,
    dreams: Dream[],
  ): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async updateFears(personId: string, dreams: Fear[]): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async updateWishes(
    personId: string,
    dreams: Wishe[],
  ): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async updateImage(image: IAvatar, personId: string): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async updateCommentsPerson(
    personId: string,
    comments: IComment[],
  ): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async getPersonsPerProject(projectId: string): Promise<IPerson[]> {
    throw new Error('Method not implemented.')
  }

  async updateAppearance(
    personId: string,
    appearance: Appearance[],
  ): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async updateTraumas(
    personId: string,
    traumas: ITrauma[],
  ): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async updatePowers(
    personId: string,
    powers: Power[],
  ): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async updateCouples(
    personId: string,
    powers: ICouple[],
  ): Promise<IPerson | null> {
    throw new Error('Method not implemented.')
  }

  async deletePerUserId(userId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async deletePerProjectId(projectId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findManyById(ids: string[]): Promise<IPerson[]> {
    throw new Error('Method not implemented.')
  }

  async listPerUser(userId: string): Promise<IPerson[]> {
    throw new Error('Method not implemented.')
  }

  async findByProjectIds(projectIds: string[]): Promise<IPerson[]> {
    throw new Error('Method not implemented.')
  }

  async getNumberOfPersonsByProjectId(projectId: string): Promise<number> {
    throw new Error('Method not implemented.')
  }

  async listAll(): Promise<IPerson[]> {
    throw new Error('Method not implemented.')
  }
}
