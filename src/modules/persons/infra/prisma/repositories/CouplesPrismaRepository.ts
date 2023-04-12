import { type ICreateCoupleDTO } from '@modules/persons/dtos/ICreateCoupleDTO'
import { type IUpdateCoupleDTO } from '@modules/persons/dtos/IUpdateCoupleDTO'
import { prisma } from '@shared/infra/database/createConnection'

import { type ICouplesRepository } from '../../repositories/contracts/ICouplesRepository'
import { type ICouple } from '../../repositories/entities/ICouple'

export class CouplesPrismaRepository implements ICouplesRepository {
  async create(data: ICreateCoupleDTO): Promise<ICouple | null> {
    const couple = await prisma.couple.create({
      data,
      include: {
        coupleWithPerson: true,
      },
    })

    return couple
  }

  async delete(coupleId: string): Promise<void> {
    await prisma.couple.delete({
      where: {
        id: coupleId,
      },
    })
  }

  async findById(coupleId: string): Promise<ICouple | null> {
    const couple = await prisma.couple.findUnique({
      where: {
        id: coupleId,
      },
    })

    return couple
  }

  async update({ coupleId, data }: IUpdateCoupleDTO): Promise<ICouple | null> {
    const couple = await prisma.couple.update({
      where: {
        id: coupleId,
      },
      data,
      include: {
        coupleWithPerson: true,
      },
    })

    return couple
  }
}
