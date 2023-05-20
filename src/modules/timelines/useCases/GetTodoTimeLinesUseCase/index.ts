import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { ITimeLinesRepository } from '@modules/timelines/infra/repositories/contracts/ITimeLinesRepository'
import { type ITimeLine } from '@modules/timelines/infra/repositories/entities/ITimeLine'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  userId: string
}

interface IResponse {
  timeLines: ITimeLine[]
}

@injectable()
export class GetTodoTimeLinesUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Repositories.TimeLinesRepository)
    private readonly timeLinesRepository: ITimeLinesRepository,
  ) {}

  async execute({ userId }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    const toDoTimeLines = await this.timeLinesRepository.findToDosPerUserId(
      userId,
    )

    return {
      timeLines: toDoTimeLines,
    }
  }
}
