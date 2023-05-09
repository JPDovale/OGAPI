import { inject, injectable } from 'tsyringe'

import { type ICreateCoupleDTO } from '@modules/persons/dtos/ICreateCoupleDTO'
import { type IUpdateCoupleDTO } from '@modules/persons/dtos/IUpdateCoupleDTO'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { prisma } from '@shared/infra/database/createConnection'

import { type ICouplesRepository } from '../../repositories/contracts/ICouplesRepository'
import { type ICouple } from '../../repositories/entities/ICouple'

@injectable()
export class CouplesPrismaRepository implements ICouplesRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async create(data: ICreateCoupleDTO): Promise<ICouple | null> {
    const couple = await prisma.couple.create({
      data,
      include: {
        coupleWithPerson: true,
      },
    })

    if (couple) {
      Promise.all([
        this.cacheProvider.delete({
          key: 'person',
          objectId: couple.person_id,
        }),

        this.cacheProvider.delete({
          key: 'person',
          objectId: couple.coupleWithPerson.person_id,
        }),
      ]).catch((err) => {
        throw err
      })
    }

    return couple
  }

  async delete(coupleId: string): Promise<void> {
    const couple = await prisma.couple.findUnique({
      where: {
        id: coupleId,
      },
      select: {
        person_id: true,
        coupleWithPerson: {
          select: {
            person_id: true,
          },
        },
      },
    })
    if (!couple) throw makeErrorNotFound({ whatsNotFound: 'Casal' })

    const promises = [
      prisma.couple.delete({
        where: {
          id: coupleId,
        },
      }),
      this.cacheProvider.delete({
        key: 'person',
        objectId: couple.coupleWithPerson.person_id,
      }),
      this.cacheProvider.delete({
        key: 'person',
        objectId: couple.person_id,
      }),
    ]

    await Promise.all(promises).catch((err) => {
      throw err
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

    const promises = [
      this.cacheProvider.delete({
        key: 'person',
        objectId: couple.coupleWithPerson.person_id,
      }),
      this.cacheProvider.delete({
        key: 'person',
        objectId: couple.person_id,
      }),
    ]

    Promise.all(promises).catch((err) => {
      throw err
    })

    return couple
  }
}
