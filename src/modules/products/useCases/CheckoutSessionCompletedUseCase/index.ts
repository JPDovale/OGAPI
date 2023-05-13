import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { ISubscriptionsRepository } from '@modules/products/infra/repositories/contracts/ISubscriptionsRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  subscriptionId: string
  customerId: string
  expiresAt: number
  mode: string
  priceId: string
}

@injectable()
export class CheckoutSessionCompletedUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Repositories.SubscriptionsRepository)
    private readonly subscriptionsRepository: ISubscriptionsRepository,

    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUserProvider: INotifyUsersProvider,
  ) {}

  async execute({
    customerId,
    subscriptionId,
    expiresAt,
    mode,
    priceId,
  }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByCustomerId(customerId)
    if (!user) throw makeErrorUserNotFound()

    if (!user.subscription) {
      await this.subscriptionsRepository.create({
        payment_status: 'active',
        subscription_stripe_id: subscriptionId,
        user_id: user.id,
        expires_at: subscriptionId ? new Date(expiresAt) : null,
        price_id: priceId,
        mode,
      })
    }

    await this.notifyUserProvider.notifyOneUser({
      title: 'Premium',
      content:
        'PARABÉNS!! Você acabou de entrar para o plano premium do MagiScrita. Espero que possa usar os nossos principais elementos de forma fácil e intuitiva...',
      userToNotifyId: user.id,
    })
  }
}
