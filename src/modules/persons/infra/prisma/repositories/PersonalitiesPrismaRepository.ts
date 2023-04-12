import { type ICreatePersonalityDTO } from '@modules/persons/dtos/ICreatePersonalityDTO'
import { type IUpdatePersonalityDTO } from '@modules/persons/dtos/IUpdatePersonalityDTO'
import { prisma } from '@shared/infra/database/createConnection'

import { type IPersonalitiesRepository } from '../../repositories/contracts/IPersonalitiesRepository'
import { type IPersonality } from '../../repositories/entities/IPersonality'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

export class PersonalitiesPrismaRepository implements IPersonalitiesRepository {
  async create(data: ICreatePersonalityDTO): Promise<IPersonality | null> {
    const personality = await prisma.personality.create({
      data,
      include: {
        consequences: true,
      },
    })

    return personality
  }

  async findById(personalityId: string): Promise<IPersonality | null> {
    const personality = await prisma.personality.findUnique({
      where: {
        id: personalityId,
      },
      include: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })

    return personality
  }

  async delete(personalityId: string): Promise<void> {
    await prisma.personality.delete({
      where: {
        id: personalityId,
      },
    })
  }

  async removeOnePersonById({
    objectId,
    personId,
  }: IRemoveOnePersonById): Promise<void> {
    await prisma.personality.update({
      where: {
        id: objectId,
      },
      data: {
        persons: {
          delete: {
            id: personId,
          },
        },
      },
    })
  }

  async addPerson({
    objectId,
    personId,
  }: IAddOnePersonInObject): Promise<void> {
    await prisma.personality.update({
      where: {
        id: objectId,
      },
      data: {
        persons: {
          connect: {
            id: personId,
          },
        },
      },
    })
  }

  async update({
    data,
    personalityId,
  }: IUpdatePersonalityDTO): Promise<IPersonality | null> {
    const personality = await prisma.personality.update({
      where: {
        id: personalityId,
      },
      data,
      include: {
        consequences: true,
      },
    })

    return personality
  }
}
