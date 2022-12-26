import { hashSync } from 'bcryptjs'
import { inject, injectable } from 'tsyringe'

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { IUserMongo } from '@modules/accounts/infra/mongoose/entities/User'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class GetUserPerCodeUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(code: string, dataObj: ICreateUserDTO): Promise<IUserMongo> {
    const { email, password, name, username, age, sex } = dataObj
    const getUserPerCode = await this.usersRepository.findByCode(code)

    if (!getUserPerCode) {
      throw new AppError('O código do usuário não foi encontrado...')
    }

    const userAlreadyExiste = await this.usersRepository.findByEmail(email)

    if (userAlreadyExiste) {
      throw new AppError(
        'Um usuário já cadastrou esse email antes. Tente outro',
      )
    }

    const passwordHash = hashSync(password, 8)

    const infosToSave: ICreateUserDTO = {
      email,
      password: passwordHash,
      age: age || 'uncharacterized',
      sex: sex || 'uncharacterized',
      username: username || name,
      name,
      code: ' ',
    }

    const user = await this.usersRepository.getUser(
      getUserPerCode.id,
      infosToSave,
    )

    return user
  }
}
