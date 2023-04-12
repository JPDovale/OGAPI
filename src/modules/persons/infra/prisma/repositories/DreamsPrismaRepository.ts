import { type ICreateDreamDTO } from '@modules/persons/dtos/ICreateDreamDTO'
import { type IUpdateDreamDTO } from '@modules/persons/dtos/IUpdateDreamDTO'
import { type Dream } from '@prisma/client'
import { prisma } from '@shared/infra/database/createConnection'

import { type IDreamsRepository } from '../../repositories/contracts/IDreamsRepository'
import { type IDream } from '../../repositories/entities/IDream'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

export class DreamsPrismaRepository implements IDreamsRepository {
  async create(data: ICreateDreamDTO): Promise<Dream | null> {
    const dream = await prisma.dream.create({
      data,
    })

    return dream
  }

  async findById(dreamId: string): Promise<Dream | null> {
    const dream = await prisma.dream.findUnique({
      where: {
        id: dreamId,
      },
      include: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })

    return dream
  }

  async delete(dreamId: string): Promise<void> {
    await prisma.dream.delete({
      where: {
        id: dreamId,
      },
    })
  }

  async removeOnePersonById({
    objectId,
    personId,
  }: IRemoveOnePersonById): Promise<void> {
    await prisma.dream.update({
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
    await prisma.dream.update({
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

  async update({ data, dreamId }: IUpdateDreamDTO): Promise<IDream | null> {
    const dream = await prisma.dream.update({
      where: {
        id: dreamId,
      },
      data,
    })

    return dream
  }
}
