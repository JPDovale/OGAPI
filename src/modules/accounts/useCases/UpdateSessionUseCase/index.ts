import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type ISession } from '@modules/accounts/infra/repositories/entities/ISession'
import InjectableDependencies from '@shared/container/types'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  sessionToken: string
  userId?: string
  expires?: Date
}

interface IResponse {
  session: ISession
}

@injectable()
export class UpdateSessionUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({
    expires,
    sessionToken,
    userId,
  }: IRequest): Promise<IResolve<IResponse>> {
    const session = await this.usersRepository.updateSession(sessionToken, {
      expires,
      user_id: userId,
    })

    if (!session) {
      return {
        ok: false,
        error: makeErrorNotFound({ whatsNotFound: 'session' }),
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
