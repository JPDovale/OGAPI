import { inject, injectable } from 'tsyringe'

import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import InjectableDependencies from '@shared/container/types'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

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

  async execute({ content, title }: IRequest): Promise<IResolve> {
    await this.notifyUsersProvider.notifyAll({ content, title })

    return {
      ok: true,
    }
  }
}
