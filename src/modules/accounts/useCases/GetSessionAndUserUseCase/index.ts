import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type ISession } from '@modules/accounts/infra/repositories/entities/ISession'
import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import InjectableDependencies from '@shared/container/types'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  sessionToken: string
}

interface IResponse {
  session: ISession
  user: IUser
}

@injectable()
export class GetSessionAndUserUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({ sessionToken }: IRequest): Promise<IResolve<IResponse>> {
    if (!sessionToken) {
      return {
        ok: false,
        error: makeErrorNotFound({ whatsNotFound: 'seção' }),
      }
    }

    const session = await this.usersRepository.findSessionByToken(sessionToken)

    if (!session) {
      return {
        ok: false,
        error: makeErrorNotFound({ whatsNotFound: 'seção' }),
      }
    }

    const user = await this.usersRepository.findById(session.user_id)

    if (!user) {
      return {
        ok: false,
        error: makeErrorUserNotFound(),
      }
    }

    return {
      ok: true,
      data: {
        session,
        user,
      },
    }
  }
}
