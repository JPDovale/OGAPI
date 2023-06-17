import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IAccount } from '@modules/accounts/infra/repositories/entities/IAccount'
import InjectableDependencies from '@shared/container/types'
import { makeErrorAccountOAuthNotCreated } from '@shared/errors/users/makeErrorAccountOAuthNotCreated'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  provider: string
  providerAccountId: string
  type: string
  accessToken: string
  expiresAt: number
  idToken: string
  refreshToken: string
  scope: string
  sessionState: string
  tokenType: string
}

interface IResponse {
  account: IAccount
}

@injectable()
export class CreateOAuthAccountUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({
    userId,
    provider,
    providerAccountId,
    type,
    accessToken,
    expiresAt,
    idToken,
    refreshToken,
    scope,
    sessionState,
    tokenType,
  }: IRequest): Promise<IResolve<IResponse>> {
    const account = await this.usersRepository.createAccount({
      user_id: userId,
      provider,
      provider_account_id: providerAccountId,
      type,
      access_token: accessToken,
      expires_at: expiresAt,
      id_token: idToken,
      refresh_token: refreshToken,
      scope,
      session_state: sessionState,
      token_type: tokenType,
    })

    if (!account) {
      return {
        ok: false,
        error: makeErrorAccountOAuthNotCreated(),
      }
    }

    return {
      ok: true,
      data: {
        account,
      },
    }
  }
}
