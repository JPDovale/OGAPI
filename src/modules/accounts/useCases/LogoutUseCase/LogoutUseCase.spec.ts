import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'

import { type IRefreshTokenRepository } from '@modules/accounts/infra/repositories/contracts/IRefreshTokenRepository'
import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { RefreshTokenRepositoryInMemory } from '@modules/accounts/infra/repositories/inMemory/RefreshTokenRepositoryInMemory'
import { UserRepositoryInMemory } from '@modules/accounts/infra/repositories/inMemory/UserRepositoryInMemory'

import { LogoutUseCase } from '.'

let refreshTokenRepositoryInMemory: IRefreshTokenRepository
let userRepositoryInMemory: IUsersRepository

let logoutUseCase: LogoutUseCase

describe('Logout', () => {
  beforeEach(() => {
    refreshTokenRepositoryInMemory = new RefreshTokenRepositoryInMemory()
    userRepositoryInMemory = new UserRepositoryInMemory()

    logoutUseCase = new LogoutUseCase(
      refreshTokenRepositoryInMemory,
      userRepositoryInMemory,
    )
  })

  it('Should be able logout', async () => {
    const newUserTest = await userRepositoryInMemory.create({
      email: 'test@example.com',
      name: 'teste',
      password: 'teste123',
      username: 'teste',
    })

    if (!newUserTest) throw new Error()

    await refreshTokenRepositoryInMemory.create({
      expires_date: new Date(),
      refresh_token: 'teste',
      user_id: newUserTest.id,
    })

    await logoutUseCase.execute({ userId: newUserTest.id })
    const refreshTokens = await refreshTokenRepositoryInMemory.findByUserId(
      newUserTest.id,
    )

    expect(refreshTokens.length).toEqual(0)
  })
})
