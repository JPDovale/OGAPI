import { compareSync, hashSync } from 'bcryptjs'
import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { AppError } from '@shared/errors/AppError'

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
    if (!user)
      throw new AppError({
        title: 'Usuário não encontrado.',
        message: 'Parece que esse usuário não existe na nossa base de dados...',
        statusCode: 404,
      })

    const passwordCorrect = compareSync(oldPassword, user.password)

    if (!passwordCorrect)
      throw new AppError({
        title: 'Senha invalida.',
        message:
          'Senha invalida, coso tenha esquecido a senha, faça o logout e acesse "esqueci a minha senha".',
      })

    const passwordHash = hashSync(password, 8)

    await this.usersRepository.updatePassword(id, passwordHash)
  }
}
