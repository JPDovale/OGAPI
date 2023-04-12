import { type ICreateValueDTO } from '@modules/persons/dtos/ICreateValueDTO'
import { type IUpdateValueDTO } from '@modules/persons/dtos/IUpdateValueDTO'
import { prisma } from '@shared/infra/database/createConnection'

import { type IValuesRepository } from '../../repositories/contracts/IValuesRepository'
import { type IValue } from '../../repositories/entities/IValue'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

export class ValuesPrismaRepository implements IValuesRepository {
  async create(data: ICreateValueDTO): Promise<IValue | null> {
    const value = await prisma.value.create({
      data,
      include: {
        exceptions: true,
      },
    })

    return value
  }

  async findById(valueId: string): Promise<IValue | null> {
    const value = await prisma.value.findUnique({
      where: {
        id: valueId,
      },
      include: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })

    return value
  }

  async delete(valueId: string): Promise<void> {
    await prisma.value.delete({
      where: {
        id: valueId,
      },
    })
  }

  async removeOnePersonById({
    objectId,
    personId,
  }: IRemoveOnePersonById): Promise<void> {
    await prisma.value.update({
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
    await prisma.value.update({
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

  async update({ data, valueId }: IUpdateValueDTO): Promise<IValue | null> {
    const value = await prisma.value.update({
      where: {
        id: valueId,
      },
      data,
      include: {
        exceptions: true,
      },
    })

    return value
  }
}
