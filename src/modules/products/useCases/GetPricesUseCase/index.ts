import { inject, injectable } from 'tsyringe'

import { IProductsService } from '@shared/container/services/ProductsService/IProductsService'
import InjectableDependencies from '@shared/container/types'

interface IPriceResponse {
  id: string
  amount: string
  type: 'recurring' | 'one_time'
}

type IRequest = null

interface IResponse {
  prices: IPriceResponse[]
}

@injectable()
export class GetPricesUseCase {
  constructor(
    @inject(InjectableDependencies.Services.ProductsService)
    private readonly productsService: IProductsService,
  ) {}

  async execute(request?: IRequest): Promise<IResponse> {
    const pricesReceived = await this.productsService.getPrices()

    const prices: IPriceResponse[] = pricesReceived.map((price) => ({
      id: price.id,
      amount: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format((price.unit_amount ?? 0) / 100),
      type: price.type,
    }))

    prices.sort((a, b) => {
      const priceA = parseFloat(a.amount.replace('R$', '').replace(',', '.'))
      const priceB = parseFloat(b.amount.replace('R$', '').replace(',', '.'))

      return priceA - priceB
    })

    return {
      prices,
    }
  }
}
