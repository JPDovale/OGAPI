import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw new AppError('User not found', 404)
    }

    try {
      await this.usersRepository.delete(id)
    } catch (err) {
      throw new AppError('Não foi possível deletar o usuário', 500)
    }
  }
}
