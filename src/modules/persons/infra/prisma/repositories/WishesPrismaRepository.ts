import { type ICreateWisheDTO } from '@modules/persons/dtos/ICreateWisheDTO'
import { type IUpdateWisheDTO } from '@modules/persons/dtos/IUpdateWisheDTO'
import { prisma } from '@shared/infra/database/createConnection'

import { type IWishesRepository } from '../../repositories/contracts/IWishesRepository'
import { type IWishe } from '../../repositories/entities/IWishe'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

export class WishesPrismaRepository implements IWishesRepository {
  async create(data: ICreateWisheDTO): Promise<IWishe | null> {
    const wishe = await prisma.wishe.create({
      data,
    })

    return wishe
  }

  async findById(wisheId: string): Promise<IWishe | null> {
    const wishe = await prisma.wishe.findUnique({
      where: {
        id: wisheId,
      },
      include: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })

    return wishe
  }

  async delete(wisheId: string): Promise<void> {
    await prisma.wishe.delete({
      where: {
        id: wisheId,
      },
    })
  }

  async removeOnePersonById({
    objectId,
    personId,
  }: IRemoveOnePersonById): Promise<void> {
    await prisma.wishe.update({
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
    await prisma.wishe.update({
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

  async update({ data, wisheId }: IUpdateWisheDTO): Promise<IWishe | null> {
    const wishe = await prisma.wishe.update({
      where: {
        id: wisheId,
      },
      data,
    })

    return wishe
  }
}
