import { inject, injectable } from 'tsyringe'

import { type Prisma } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { prisma } from '@shared/infra/database/createConnection'

import { type ITimeEventsRepository } from '../../repositories/contracts/ITimeEventsRepository'
import { type ITimeEvent } from '../../repositories/entities/ITimeEvent'

@injectable()
export class TimeEventsPrismaRepository implements ITimeEventsRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async create(
    data: Prisma.TimeEventUncheckedCreateInput,
  ): Promise<ITimeEvent | null> {
    const timeEvent = await prisma.timeEvent.create({
      data,
    })

    return timeEvent
  }
}
