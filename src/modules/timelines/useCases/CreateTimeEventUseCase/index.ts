import { inject, injectable } from 'tsyringe'

import { ITimeEventsRepository } from '@modules/timelines/infra/repositories/contracts/ITimeEventsRepository'
import { ITimeLinesRepository } from '@modules/timelines/infra/repositories/contracts/ITimeLinesRepository'
import { type ITimeEvent } from '@modules/timelines/infra/repositories/entities/ITimeEvent'
import { type ITimeLine } from '@modules/timelines/infra/repositories/entities/ITimeLine'
import { type ITimeLinePreview } from '@modules/timelines/infra/repositories/entities/ITimeLinePreview'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorTimeEventNotCreated } from '@shared/errors/timelines/makeErrorTimeEventNotCreated'
import { makeErrorTimeLineNotFound } from '@shared/errors/timelines/makeErrorTimeLineNotFound'

interface IRequest {
  userId: string
  projectId: string
  timeLineId?: string
  title: string
  description: string
  importance: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  happenedHour: number
  happenedMinute: number
  happenedSecond: number
  happenedYear: number
  happenedMonth: number
  happenedDay: number
  timeChrist: 'A.C.' | 'D.C.'
}

interface IResponse {
  timeEvent: ITimeEvent
}

@injectable()
export class CreateTimeEventUseCase {
  constructor(
    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissionsService: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.TimeLinesRepository)
    private readonly timeLinesRepository: ITimeLinesRepository,

    @inject(InjectableDependencies.Providers.DateProvider)
    private readonly dateProvider: IDateProvider,

    @inject(InjectableDependencies.Repositories.TimeEventsRepository)
    private readonly timeEventsRepository: ITimeEventsRepository,
  ) {}

  async execute({
    description,
    happenedDay,
    happenedHour,
    happenedMinute,
    happenedMonth,
    happenedSecond,
    happenedYear,
    importance,
    projectId,
    timeChrist,
    title,
    userId,
    timeLineId,
  }: IRequest): Promise<IResponse> {
    const { project } = await this.verifyPermissionsService.verify({
      projectId,
      userId,
      verifyPermissionTo: 'edit',
      clearCache: true,
      verifyFeatureInProject: ['timeLines'],
    })

    let timeLineToAddTimeEvent: ITimeLine | ITimeLinePreview | null

    if (!timeLineId) {
      const mainTimeLineProject = project.timeLines?.find(
        (timeLine) => !timeLine.is_alternative,
      )

      timeLineToAddTimeEvent = mainTimeLineProject ?? null
    } else {
      const timeLine = await this.timeLinesRepository.findById(timeLineId)

      timeLineToAddTimeEvent = timeLine
    }

    if (!timeLineToAddTimeEvent) throw makeErrorTimeLineNotFound()

    const eventHappenedDateTimestamp = this.dateProvider.getTimestamp({
      year: happenedYear,
      month: happenedMonth,
      day: happenedDay,
      hour: happenedHour,
      minute: happenedMinute,
      second: happenedSecond,
      timeChrist: timeChrist === 'A.C.' ? 0 : 1,
    })

    const eventHappenedFate = this.dateProvider.getDateByTimestamp(
      eventHappenedDateTimestamp,
    )

    const timeEvent = await this.timeEventsRepository.create({
      happened_date: eventHappenedFate.fullDate,
      happened_date_timestamp: eventHappenedDateTimestamp.toString(),
      happened_year: eventHappenedFate.year.label,
      happened_year_time_christ: eventHappenedFate.fullDate.includes('-')
        ? 'A.C.'
        : 'D.C.',
      happened_month: eventHappenedFate.month.label,
      happened_day: eventHappenedFate.day.value,
      happened_hour: eventHappenedFate.hour.value,
      happened_minute: eventHappenedFate.minute.value,
      happened_second: eventHappenedFate.second.value,
      time_line_id: timeLineToAddTimeEvent.id,
      importance: Number(importance),
      title,
      description,
    })

    if (!timeEvent) throw makeErrorTimeEventNotCreated()

    return {
      timeEvent,
    }
  }
}
