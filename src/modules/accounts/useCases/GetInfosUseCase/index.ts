import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  userId: string
}

interface IResponse {
  user: IUserInfosResponse
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

    const response: IUserInfosResponse = {
      age: user.age,
      avatar_filename: user.avatar_filename,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
      is_social_login: user.is_social_login,
      email: user.email,
      sex: user.sex,
      username: user.username,
      id: user.id,
      notifications: user.notifications ?? [],
      name: user.name,
      new_notifications: user.new_notifications,
    }

    return { user: response }
  }
}
