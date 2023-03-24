import { hashSync } from 'bcryptjs'
import { inject, injectable } from 'tsyringe'

import { type ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { type IUserMongo } from '@modules/accounts/infra/mongoose/entities/User'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { AppError } from '@shared/errors/AppError'
import { makeErrorUserAlreadyExistes } from '@shared/errors/users/makeErrorUserAlreadyExistes'
import { makeErrorUserNotCreated } from '@shared/errors/users/makeErrorUserNotCreated'

interface IRequest {
  code: string
  infosUser: ICreateUserDTO
}
@injectable()
export class GetUserPerCodeUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({ code, infosUser }: IRequest): Promise<IUserMongo> {
    const { email, password, name, username, age, sex } = infosUser
    const getUserPerCode = await this.usersRepository.findByCode(code)

    if (!getUserPerCode) {
      throw new AppError({
        title: 'O código não é valido.',
        message:
          'O código informado não pode ser validado, Verifique-o e tente novamente.',
      })
    }

    const userAlreadyExiste = await this.usersRepository.findByEmail(email)

    if (userAlreadyExiste) throw makeErrorUserAlreadyExistes()

    const passwordHash = hashSync(password, 8)

    const infosToSave: ICreateUserDTO = {
      email,
      password: passwordHash,
      age: age ?? 'uncharacterized',
      sex: sex ?? 'uncharacterized',
      username: username ?? name,
      name,
      code: ' ',
      isInitialized: true,
    }

    const user = await this.usersRepository.getUser(
      getUserPerCode.id,
      infosToSave,
    )

    if (!user) throw makeErrorUserNotCreated()

    return user
  }
}
