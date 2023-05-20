import { inject, injectable } from 'tsyringe'

import { type Prisma } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { prisma } from '@shared/infra/database/createConnection'

import { type ITimeLinesRepository } from '../../repositories/contracts/ITimeLinesRepository'
import { type ITimeLine } from '../../repositories/entities/ITimeLine'

const defaultInclude: Prisma.TimeLineInclude = {
  timeEvents: {
    include: {
      timeEventBorn: true,
      timeEventToDo: true,
      persons: {
        select: {
          id: true,
          image_url: true,
          name: true,
          last_name: true,
        },
      },
    },
  },
}

@injectable()
export class TimeLinesPrismaRepository implements ITimeLinesRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async findMainOfProject(projectID: string): Promise<ITimeLine | null> {
    const timeLine = await prisma.timeLine.findFirst({
      where: {
        project_id: projectID,
        is_alternative: false,
      },
      include: {
        timeEvents: true,
      },
    })

    return timeLine
  }

  async create(
    data: Prisma.TimeLineUncheckedCreateInput,
  ): Promise<ITimeLine | null> {
    const timeLine = await prisma.timeLine.create({
      data,
      include: defaultInclude,
    })

    return timeLine
  }

  async deletePerProjectId(projectId: string): Promise<void> {
    await prisma.timeLine.deleteMany({
      where: {
        project_id: projectId,
      },
    })
  }

  async findById(timeLineId: string): Promise<ITimeLine | null> {
    const timeLine = await prisma.timeLine.findUnique({
      where: {
        id: timeLineId,
      },
      include: defaultInclude,
    })

    return timeLine
  }

  async findToDosPerUserId(userId: string): Promise<ITimeLine[]> {
    const timeLinesToDo = await prisma.timeLine.findMany({
      where: {
        user_id: userId,
        type: 'to_do',
      },
      include: defaultInclude,
    })

    return timeLinesToDo
  }
}
