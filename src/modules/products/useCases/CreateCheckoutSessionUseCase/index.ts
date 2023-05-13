import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IProductsService } from '@shared/container/services/ProductsService/IProductsService'
import InjectableDependencies from '@shared/container/types'
import { makeErrorSubscriptionAlreadyExistsToUser } from '@shared/errors/products/makeErrorSubscriptionAlreadyExistsToUser'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  userId: string
  priceId: string
}

interface IResponse {
  checkoutSessionId: string
}

@injectable()
export class CreateCheckoutSessionUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Services.ProductsService)
    private readonly productsServices: IProductsService,
  ) {}

  async execute({ priceId, userId }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    if (user.subscription) {
      throw makeErrorSubscriptionAlreadyExistsToUser()
    }

    const price = await this.productsServices.getPrice(priceId)

    let idCustomer = user.id_customer

    if (!idCustomer) {
      const customer = await this.productsServices.createCustomer({
        email: user.email,
      })

      await this.usersRepository.updateUser({
        userId,
        data: {
          id_customer: customer.id,
        },
      })

      idCustomer = customer.id
    }

    const checkoutSession = await this.productsServices.createCheckoutSession({
      customerId: idCustomer,
      mode: price.type === 'recurring' ? 'subscription' : 'payment',
      priceId: price.id,
    })

    return {
      checkoutSessionId: checkoutSession.id,
    }
  }
}
