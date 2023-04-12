import { type ICreateTraumaDTO } from '@modules/persons/dtos/ICreateTraumaDTO'
import { type IUpdateTraumaDTO } from '@modules/persons/dtos/IUpdateTraumaDTO'
import { prisma } from '@shared/infra/database/createConnection'

import { type ITraumasRepository } from '../../repositories/contracts/ITraumasRepository'
import { type ITrauma } from '../../repositories/entities/ITrauma'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

export class TraumasPrismaRepository implements ITraumasRepository {
  async create(data: ICreateTraumaDTO): Promise<ITrauma | null> {
    const trauma = await prisma.trauma.create({
      data,
      include: {
        consequences: true,
      },
    })

    return trauma
  }

  async findById(traumaId: string): Promise<ITrauma | null> {
    const trauma = await prisma.trauma.findUnique({
      where: {
        id: traumaId,
      },
      include: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })

    return trauma
  }

  async delete(traumaId: string): Promise<void> {
    await prisma.trauma.delete({
      where: {
        id: traumaId,
      },
    })
  }

  async removeOnePersonById({
    objectId,
    personId,
  }: IRemoveOnePersonById): Promise<void> {
    await prisma.trauma.update({
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
    await prisma.trauma.update({
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

  async update({ data, traumaId }: IUpdateTraumaDTO): Promise<ITrauma | null> {
    const trauma = await prisma.trauma.update({
      where: {
        id: traumaId,
      },
      data,
      include: {
        consequences: true,
      },
    })

    return trauma
  }
}
