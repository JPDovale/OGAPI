import { compareSync, hashSync } from 'bcryptjs'
import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { makeErrorUserWrongPassword } from '@shared/errors/users/makeErrorUserWrongPassword'

interface IRequest {
  id: string
  oldPassword: string
  password: string
}

@injectable()
export class PasswordUpdateUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({ id, oldPassword, password }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(id)

    if (!user) throw makeErrorUserNotFound()

    const passwordCorrect = compareSync(oldPassword, user.password)

    if (!passwordCorrect) throw makeErrorUserWrongPassword()

    const passwordHash = hashSync(password, 8)

    await this.usersRepository.updatePassword(id, passwordHash)
  }
}
