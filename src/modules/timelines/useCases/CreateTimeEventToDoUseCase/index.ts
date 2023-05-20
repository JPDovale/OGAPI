import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { ITimeEventsRepository } from '@modules/timelines/infra/repositories/contracts/ITimeEventsRepository'
import { ITimeLinesRepository } from '@modules/timelines/infra/repositories/contracts/ITimeLinesRepository'
import { type ITimeEvent } from '@modules/timelines/infra/repositories/entities/ITimeEvent'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorTimeEventNotCreated } from '@shared/errors/timelines/makeErrorTimeEventNotCreated'
import { makeErrorTimeLineNotFound } from '@shared/errors/timelines/makeErrorTimeLineNotFound'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  userId: string
  timeLineId: string
  title: string
  description: string
  happenedHour: number
  happenedMinute: number
  happenedSecond: number
  happenedYear: number
  happenedMonth: number
  happenedDay: number
}

interface IResponse {
  timeEvent: ITimeEvent
}

@injectable()
export class CreateTimeEventToDoUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

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
    title,
    userId,
    timeLineId,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    const timeLine = await this.timeLinesRepository.findById(timeLineId)
    if (!timeLine || timeLine.type !== 'to_do')
      throw makeErrorTimeLineNotFound()

    const eventHappenedDateTimestamp = this.dateProvider.getTimestamp({
      year: happenedYear,
      month: happenedMonth,
      day: happenedDay,
      hour: happenedHour,
      minute: happenedMinute,
      second: happenedSecond,
      timeChrist: 1,
    })

    const dateStartOfTimeLineTimestamp = this.dateProvider.getTimestamp(
      timeLine.start_date!,
    )
    const dateEndTimeLineTimestamp = this.dateProvider.getTimestamp(
      timeLine.end_date!,
    )

    const dateIsAfterStartDateTimeLine = this.dateProvider.isBefore({
      startDate: new Date(dateStartOfTimeLineTimestamp),
      endDate: new Date(eventHappenedDateTimestamp),
    })

    const dateIsBeforeEndDateTimeLine = this.dateProvider.isBefore({
      startDate: new Date(eventHappenedDateTimestamp),
      endDate: new Date(dateEndTimeLineTimestamp),
    })

    if (!dateIsAfterStartDateTimeLine || !dateIsBeforeEndDateTimeLine)
      throw makeErrorTimeEventNotCreated()

    const eventHappenedDate = this.dateProvider.getDateByTimestamp(
      eventHappenedDateTimestamp,
    )

    const timeEvent = await this.timeEventsRepository.create({
      happened_date: eventHappenedDate.fullDate,
      happened_date_timestamp: eventHappenedDateTimestamp.toString(),
      happened_year: eventHappenedDate.year.label,
      happened_year_time_christ: eventHappenedDate.fullDate.includes('-')
        ? 'A.C.'
        : 'D.C.',
      happened_month: eventHappenedDate.month.label,
      happened_day: eventHappenedDate.day.value,
      happened_hour: eventHappenedDate.hour.value,
      happened_minute: eventHappenedDate.minute.value,
      happened_second: eventHappenedDate.second.value,
      time_line_id: timeLine.id,
      importance: 7,
      title,
      description,
    })

    if (!timeEvent) throw makeErrorTimeEventNotCreated()

    return {
      timeEvent,
    }
  }
}
