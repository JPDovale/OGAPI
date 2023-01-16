import { RefreshTokenRepositoryInMemory } from '@modules/accounts/repositories/inMemory/RefreshTokenRepositoryInMemory'
import { UserRepositoryInMemory } from '@modules/accounts/repositories/inMemory/UserRepositoryInMemory'
import { DayJsDateProvider } from '@shared/container/provides/DateProvider/implementations/DayJsDateProvider'
import { AppError } from '@shared/errors/AppError'

import { LoginWithGoogleUseCase } from './LoginWithGoogleUseCase'

let userRepositoryInMemory: UserRepositoryInMemory
let refreshTokenRepositoryInMemory: RefreshTokenRepositoryInMemory

let dateProvider = new DayJsDateProvider()

let loginWithGoogleUseCase: LoginWithGoogleUseCase

describe('Login with Google', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    refreshTokenRepositoryInMemory = new RefreshTokenRepositoryInMemory()

    dateProvider = new DayJsDateProvider()

    loginWithGoogleUseCase = new LoginWithGoogleUseCase(
      userRepositoryInMemory,
      refreshTokenRepositoryInMemory,
      dateProvider,
    )
  })

  it('Should be able to login in application using Google', async () => {
    const newSession = await loginWithGoogleUseCase.execute(
      'teste@teste',
      undefined,
      'test',
    )

    expect(newSession).toHaveProperty('user')
    expect(newSession).toHaveProperty('token')
    expect(newSession).toHaveProperty('refreshToken')
    expect(newSession.user.isSocialLogin).toEqual(true)
  })

  it('not should be able to login in application using Google if account is not social login', async () => {
    expect(async () => {
      await userRepositoryInMemory.create({
        name: 'test',
        age: 'test',
        email: 'test@teste',
        password: 'test',
        sex: 'test',
        username: 'test',
        isSocialLogin: false,
      })

      await loginWithGoogleUseCase.execute('test@teste', undefined, 'test')
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
