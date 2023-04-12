import { type ICreateFearDTO } from '@modules/persons/dtos/ICreateFearDTO'
import { type IUpdateFearDTO } from '@modules/persons/dtos/IUpdateFearDTO'
import { type Fear } from '@prisma/client'
import { prisma } from '@shared/infra/database/createConnection'

import { type IFearsRepository } from '../../repositories/contracts/IFearsRepository'
import { type IFear } from '../../repositories/entities/IFear'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

export class FearsPrismaRepository implements IFearsRepository {
  async create(data: ICreateFearDTO): Promise<Fear | null> {
    const fear = await prisma.fear.create({
      data,
    })

    return fear
  }

  async findById(fearId: string): Promise<Fear | null> {
    const fear = await prisma.fear.findUnique({
      where: {
        id: fearId,
      },
      include: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })

    return fear
  }

  async delete(fearId: string): Promise<void> {
    await prisma.fear.delete({
      where: {
        id: fearId,
      },
    })
  }

  async removeOnePersonById({
    objectId,
    personId,
  }: IRemoveOnePersonById): Promise<void> {
    await prisma.fear.update({
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
    await prisma.fear.update({
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

  async update({ data, fearId }: IUpdateFearDTO): Promise<IFear | null> {
    const fear = prisma.fear.update({
      where: {
        id: fearId,
      },
      data,
    })

    return await fear
  }
}
