import { inject, injectable } from 'tsyringe'

import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import InjectableDependencies from '@shared/container/types'

interface IRequest {
  title: string
  content: string
}

@injectable()
export class NotifyAllUsersUseCase {
  constructor(
    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,
  ) {}

  async execute({ content, title }: IRequest): Promise<void> {
    await this.notifyUsersProvider.notifyAll({ content, title })
  }
}
