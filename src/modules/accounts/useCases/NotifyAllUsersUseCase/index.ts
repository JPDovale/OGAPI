import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

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

    if (!user) throw makeErrorUserNotFound()

    await this.notifyUsersProvider.notifyAll({ sendBy: user, content, title })
    await this.cacheProvider.refresh()
  }
}
