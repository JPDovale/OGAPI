import { inject, injectable } from 'tsyringe'

import { type IEvent } from '@modules/products/infra/repositories/entities/IEvent'
import { IProductsService } from '@shared/container/services/ProductsService/IProductsService'
import InjectableDependencies from '@shared/container/types'

interface IRequest {
  secret: string | string[] | undefined
  request: Buffer
}

interface IResponse {
  event: IEvent
}

@injectable()
export class GetEventWebhookUseCase {
  constructor(
    @inject(InjectableDependencies.Services.ProductsService)
    private readonly productsService: IProductsService,
  ) {}

  async execute({ request, secret }: IRequest): Promise<IResponse> {
    const event = await this.productsService.getEvent(secret, request)

    return {
      event,
    }
  }
}
