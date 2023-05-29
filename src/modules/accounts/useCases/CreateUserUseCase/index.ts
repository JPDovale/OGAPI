import { hashSync } from 'bcryptjs'
import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import { IMailProvider } from '@shared/container/providers/MailProvider/IMailProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserAlreadyExistes } from '@shared/errors/users/makeErrorUserAlreadyExistes'
import { makeErrorUserNotCreated } from '@shared/errors/users/makeErrorUserNotCreated'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  name: string
  email: string
  password: string
  sex?: string
  age?: string
  username?: string
}

interface IResponse {
  user: IUser
}

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Providers.MailGunProvider)
    private readonly mailProvider: IMailProvider,
  ) {}

  async execute(request: IRequest): Promise<IResolve<IResponse>> {
    const { age, email, name, password, sex, username } = request

    const userAlreadyExiste = await this.usersRepository.findByEmail(email)
    if (userAlreadyExiste) {
      return {
        ok: false,
        error: makeErrorUserAlreadyExistes(),
      }
    }

    const passwordHash = hashSync(password, 8)
    const newUser = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
      age,
      sex,
      username: username ?? name,
    })

    if (!newUser) {
      return {
        ok: false,
        error: makeErrorUserNotCreated(),
      }
    }

    await this.mailProvider.registerInMailMarketing({
      email: newUser.email,
      attributes: {
        NOME: newUser.name,
      },
    })

    return {
      ok: true,
      data: {
        user: newUser,
      },
    }
  }
}
