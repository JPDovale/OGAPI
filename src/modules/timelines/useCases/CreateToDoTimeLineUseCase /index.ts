import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { ITimeLinesRepository } from '@modules/timelines/infra/repositories/contracts/ITimeLinesRepository'
import { type ITimeLine } from '@modules/timelines/infra/repositories/entities/ITimeLine'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorTimeLineNotCreated } from '@shared/errors/timelines/makeErrorTimeLineNotCreated'
import { makeErrorLimitFreeInEnd } from '@shared/errors/useFull/makeErrorLimitFreeInEnd'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  userId: string
  title: string
  description: string
  startDate: Date
  endDate: Date
}

interface IResponse {
  timeLine: ITimeLine
}

@injectable()
export class CreateToDoTimeLineUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.TimeLinesRepository)
    private readonly timeLinesRepository: ITimeLinesRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usesRepository: IUsersRepository,

    @inject(InjectableDependencies.Providers.DateProvider)
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute({
    description,
    title,
    userId,
    startDate,
    endDate,
  }: IRequest): Promise<IResponse> {
    const user = await this.usesRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    if (user.subscription?.payment_status !== 'active')
      throw makeErrorLimitFreeInEnd()

    const startDateIsBeforeEndDate = this.dateProvider.isBefore({
      startDate,
      endDate,
    })

    if (!startDateIsBeforeEndDate) throw makeErrorTimeLineNotCreated()

    const timeLine = await this.timeLinesRepository.create({
      user_id: userId,
      description,
      title,
      type: 'to_do',
      start_date: startDate,
      end_date: endDate,
    })

    if (!timeLine) throw makeErrorTimeLineNotCreated()

    return {
      timeLine,
    }
  }
}
