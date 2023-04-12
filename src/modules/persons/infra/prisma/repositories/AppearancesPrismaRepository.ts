import { type ICreateAppearanceDTO } from '@modules/persons/dtos/ICreateAppearanceDTO'
import { type IUpdateAppearanceDTO } from '@modules/persons/dtos/IUpdateAppearanceDTO'
import { prisma } from '@shared/infra/database/createConnection'

import { type IAppearancesRepository } from '../../repositories/contracts/IAppearancesRepository'
import { type IAppearance } from '../../repositories/entities/IAppearance'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

export class AppearancesPrismaRepository implements IAppearancesRepository {
  async create(data: ICreateAppearanceDTO): Promise<IAppearance> {
    const appearance = await prisma.appearance.create({
      data,
    })

    return appearance
  }

  async findById(appearanceId: string): Promise<IAppearance | null> {
    const appearance = await prisma.appearance.findUnique({
      where: {
        id: appearanceId,
      },
      include: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })

    return appearance
  }

  async delete(appearanceId: string): Promise<void> {
    await prisma.appearance.delete({
      where: {
        id: appearanceId,
      },
    })
  }

  async removeOnePersonById({
    objectId,
    personId,
  }: IRemoveOnePersonById): Promise<void> {
    await prisma.appearance.update({
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
    await prisma.appearance.update({
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
    appearanceId,
    data,
  }: IUpdateAppearanceDTO): Promise<IAppearance | null> {
    const appearance = await prisma.appearance.update({
      where: {
        id: appearanceId,
      },
      data,
    })

    return appearance
  }
}
