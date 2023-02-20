import dotenv from 'dotenv'
import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { ICacheProvider } from '@shared/container/provides/CacheProvider/ICacheProvider'
import { INotifyUsersProvider } from '@shared/container/provides/NotifyUsersProvider/INotifyUsersProvider'
import { AppError } from '@shared/errors/AppError'
dotenv.config()

interface IRequest {
  title: string
  content: string
}

@injectable()
export class NotifyAllUsersUseCase {
  constructor(
    @inject('NotifyUsersProvider')
    private readonly notifyUsersProvider: INotifyUsersProvider,
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async execute({ content, title }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail('ognare.app@gmail.com')

    if (!user) {
      throw new AppError({
        title: 'Usuário não encontrado.',
        message: 'Parece que esse usuário não existe na nossa base de dados...',
        statusCode: 404,
      })
    }

    await this.notifyUsersProvider.notifyAll({ sendBy: user, content, title })
    await this.cacheProvider.refresh()
  }
}
