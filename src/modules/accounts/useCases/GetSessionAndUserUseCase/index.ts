import { sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import session from '@config/session'
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
  token: string
  refreshToken: string
}

const {
  secretToken,
  expiresInToken,
  secretRefreshToken,
  expiresInRefreshToken,
} = session

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

    const token = sign(
      {
        admin: user.admin,
        name: user.username,
        email: user.email,
      },
      secretToken,
      {
        subject: user.id,
        expiresIn: expiresInToken,
      },
    )

    const refreshToken = sign(
      {
        admin: user.admin,
        name: user.username,
        email: user.email,
      },
      secretRefreshToken,
      {
        subject: user.id,
        expiresIn: expiresInRefreshToken,
      },
    )

    return {
      ok: true,
      data: {
        session,
        user,
        token,
        refreshToken,
      },
    }
  }
}
