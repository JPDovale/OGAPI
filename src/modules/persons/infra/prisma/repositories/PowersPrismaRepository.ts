import { type ICreatePowerDTO } from '@modules/persons/dtos/ICreatePowerDTO'
import { type IUpdatePowerDTO } from '@modules/persons/dtos/IUpdatePowerDTO'
import { prisma } from '@shared/infra/database/createConnection'

import { type IPowersRepository } from '../../repositories/contracts/IPowersRepository'
import { type IPower } from '../../repositories/entities/IPower'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

export class PowersPrismaRepository implements IPowersRepository {
  async create(data: ICreatePowerDTO): Promise<IPower | null> {
    const power = await prisma.power.create({
      data,
    })

    return power
  }

  async findById(powerId: string): Promise<IPower | null> {
    const power = await prisma.power.findUnique({
      where: {
        id: powerId,
      },
      include: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })

    return power
  }

  async delete(powerId: string): Promise<void> {
    await prisma.power.delete({
      where: {
        id: powerId,
      },
    })
  }

  async removeOnePersonById({
    objectId,
    personId,
  }: IRemoveOnePersonById): Promise<void> {
    await prisma.power.update({
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
    await prisma.power.update({
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

  async update({ data, powerId }: IUpdatePowerDTO): Promise<IPower | null> {
    const power = await prisma.power.update({
      where: {
        id: powerId,
      },
      data,
    })

    return power
  }
}
