import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { GetPricesUseCase } from '@modules/products/useCases/GetPricesUseCase'

export class GetPricesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const getPricesUseCase = container.resolve(GetPricesUseCase)
    const { prices } = await getPricesUseCase.execute()

    return res.status(200).json({ prices })
  }
}
