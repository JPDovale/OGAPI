import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUserPreview } from '@modules/accounts/responses/IUserPreview'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  userId: string
}

interface IResponse {
  user: IUserPreview
}

@injectable()
export class GetInfosUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly userRepository: IUsersRepository,
  ) {}

  async execute({ userId }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    return {
      user: {
        avatar_url: user.avatar_url,
        email: user.email,
        id: user.id,
        new_notifications: user.new_notifications,
        username: user.username,
        notifications: user.notifications,
        subscription: user.subscription,
      },
    }
  }
}
