import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { ISubscriptionsRepository } from '@modules/products/infra/repositories/contracts/ISubscriptionsRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IProductsService } from '@shared/container/services/ProductsService/IProductsService'
import InjectableDependencies from '@shared/container/types'
import { makeInternalError } from '@shared/errors/useFull/makeInternalError'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  customerId: string
  subscriptionId: string
}

@injectable()
export class UpdateSubscriptionUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.SubscriptionsRepository)
    private readonly subscriptionsRepository: ISubscriptionsRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Services.ProductsService)
    private readonly productsService: IProductsService,

    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,
  ) {}

  async execute({ customerId, subscriptionId }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByCustomerId(customerId)
    if (!user) throw makeErrorUserNotFound()

    const subscriptionStripe = await this.productsService.getSubscription(
      subscriptionId,
    )

    const subscription =
      await this.subscriptionsRepository.updatePerStripeSubscriptionId({
        stripeSubscriptionId: subscriptionStripe.id,
        data: {
          payment_status: subscriptionStripe.status,
          price_id: subscriptionStripe.items.data[0].price.id,
        },
      })
    if (!subscription) throw makeInternalError()

    switch (subscriptionStripe.status) {
      case 'canceled':
        await this.notifyUsersProvider.notifyOneUser({
          title: 'Premium cancelado',
          content: 'Sua inscrição no plano do MagiScrita foi cancelada',
          userToNotifyId: user.id,
        })

        await this.subscriptionsRepository.delete(subscription.id)
        break

      case 'unpaid':
        await this.notifyUsersProvider.notifyOneUser({
          title: 'Premium com pagamento pendente',
          content:
            'Sua inscrição no plano do MagiScrita foi está  com pagamento pendente... Verifique para evitar o cancelamento e a exclusão dos seus projetos',
          userToNotifyId: user.id,
        })
        break

      case 'incomplete_expired':
        await this.notifyUsersProvider.notifyOneUser({
          title: 'Premium expirado',
          content:
            'Sua inscrição no plano do MagiScrita expirou... Você tem 7 dias para renovar o plano, ou seus projetos que exerdem o plano free serão excluídos.',
          userToNotifyId: user.id,
        })
        break
      default:
        break
    }
  }
}
