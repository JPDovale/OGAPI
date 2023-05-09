import { type IUpdateBoxDTO } from '@modules/boxes/dtos/IUpdateBoxDTO'
import { type Prisma } from '@prisma/client'
import { prisma } from '@shared/infra/database/createConnection'

import { type IBoxesRepository } from '../../repositories/contracts/IBoxesRepository'
import { type IBox } from '../../repositories/entities/IBox'

export class BoxesPrismaRepository implements IBoxesRepository {
  async create(data: Prisma.BoxUncheckedCreateInput): Promise<IBox | null> {
    const box = await prisma.box.create({
      data,
      include: {
        archives: {
          include: {
            gallery: true,
          },
        },
      },
    })

    return box
  }

  async listPerUser(userId: string): Promise<IBox[]> {
    const boxes = prisma.box.findMany({
      where: {
        user_id: userId,
      },
      include: {
        archives: {
          include: {
            gallery: true,
          },
        },
        tags: true,
      },
    })

    return await boxes
  }

  async delete(boxId: string): Promise<void> {
    await prisma.box.delete({
      where: {
        id: boxId,
      },
    })
  }

  async update({ boxId, data }: IUpdateBoxDTO): Promise<IBox | null> {
    const box = await prisma.box.update({
      where: {
        id: boxId,
      },
      data,
      include: {
        archives: {
          include: {
            gallery: true,
          },
        },
      },
    })

    return box
  }

  async findById(bokId: string): Promise<IBox | null> {
    const box = await prisma.box.findUnique({
      where: {
        id: bokId,
      },
      include: {
        archives: {
          include: {
            gallery: true,
          },
        },
      },
    })

    return box
  }

  async listInternals(): Promise<IBox[]> {
    throw new Error('Method not implemented.')
  }

  async listAllNotInternal(): Promise<IBox[]> {
    throw new Error('Method not implemented.')
  }
}
