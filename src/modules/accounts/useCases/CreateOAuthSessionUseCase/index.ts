import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type ISession } from '@modules/accounts/infra/repositories/entities/ISession'
import InjectableDependencies from '@shared/container/types'
import { makeErrorAccountOAuthNotCreated } from '@shared/errors/users/makeErrorAccountOAuthNotCreated'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  expires: Date
  sessionToken: string
}

interface IResponse {
  session: ISession
}

@injectable()
export class CreateOAuthSessionUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({
    userId,
    expires,
    sessionToken,
  }: IRequest): Promise<IResolve<IResponse>> {
    const session = await this.usersRepository.createSession({
      user_id: userId,
      expires,
      session_token: sessionToken,
    })

    if (!session) {
      return {
        ok: false,
        error: makeErrorAccountOAuthNotCreated(),
      }
    }

    return {
      ok: true,
      data: {
        session,
      },
    }
  }
}
