import { type ICreateCapituleDTO } from '@modules/books/dtos/ICreateCapituleDTO'
import { type IUpdateCapituleDTO } from '@modules/books/dtos/IUpdateCapituleDTO'
import { type IUpdateManyCapitulesDTO } from '@modules/books/dtos/IUpdateManyCapitulesDTO'
import { type Prisma } from '@prisma/client'
import { prisma } from '@shared/infra/database/createConnection'

import { type ICapitulesRepository } from '../../repositories/contracts/ICapitulesRepository'
import { type ICapitule } from '../../repositories/entities/ICapitule'
import { type IScene } from '../../repositories/entities/IScene'

export class CapitulesPrismaRepository implements ICapitulesRepository {
  async create(data: ICreateCapituleDTO): Promise<ICapitule | null> {
    const capitule = await prisma.capitule.create({
      data,
      include: {
        scenes: {
          include: {
            persons: true,
          },
        },
      },
    })

    return capitule
  }

  async findById(capituleId: string): Promise<ICapitule | null> {
    const capitule = await prisma.capitule.findUnique({
      where: {
        id: capituleId,
      },
      include: {
        scenes: {
          include: {
            persons: true,
          },
        },
        comments: {
          include: {
            responses: true,
          },
        },
        book: {
          select: {
            project_id: true,
          },
        },
      },
    })

    return capitule
  }

  async delete(capituleId: string): Promise<void> {
    await prisma.capitule.delete({
      where: {
        id: capituleId,
      },
    })
  }

  async updateMany(data: IUpdateManyCapitulesDTO): Promise<void> {
    const factoryDataWithObjectsPossibleNull: Array<Prisma.CapituleUpdateArgs | null> =
      data.map((update) => {
        if (!update) return null

        return {
          where: {
            id: update.capituleId,
          },
          data: update.data,
        }
      })

    const factoryData: Prisma.CapituleUpdateArgs[] =
      factoryDataWithObjectsPossibleNull.filter(
        (update): update is Prisma.CapituleUpdateArgs => update !== null,
      )

    await prisma.$transaction(
      factoryData.map((update) => prisma.capitule.update(update)),
    )
  }

  async update({
    capituleId,
    data,
  }: IUpdateCapituleDTO): Promise<ICapitule | null> {
    const capitule = await prisma.capitule.update({
      where: {
        id: capituleId,
      },
      data,
      include: {
        scenes: {
          include: {
            persons: true,
          },
        },
      },
    })

    return capitule
  }

  async listScenes(capituleId: string): Promise<IScene[]> {
    const capitule = await prisma.capitule.findUnique({
      where: {
        id: capituleId,
      },
      select: {
        scenes: {
          include: {
            persons: true,
          },
        },
      },
    })

    return capitule?.scenes ?? []
  }
}
