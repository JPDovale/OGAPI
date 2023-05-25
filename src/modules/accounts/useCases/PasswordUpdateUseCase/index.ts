import { compareSync, hashSync } from 'bcryptjs'
import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { makeErrorUserWrongPassword } from '@shared/errors/users/makeErrorUserWrongPassword'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  id: string
  oldPassword: string
  password: string
}

@injectable()
export class PasswordUpdateUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({ id, oldPassword, password }: IRequest): Promise<IResolve> {
    const user = await this.usersRepository.findById(id)
    if (!user) {
      return {
        ok: false,
        error: makeErrorUserNotFound(),
      }
    }

    const passwordCorrect = compareSync(oldPassword, user.password)
    if (!passwordCorrect) {
      return {
        ok: false,
        error: makeErrorUserWrongPassword(),
      }
    }

    const passwordHash = hashSync(password, 8)
    await this.usersRepository.updateUser({
      userId: id,
      data: {
        password: passwordHash,
      },
    })

    return {
      ok: true,
    }
  }
}
