import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateCheckoutSessionUseCase } from '@modules/products/useCases/CreateCheckoutSessionUseCase'

export class CreateCheckoutSessionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createCheckoutSessionParamsSchema = z.object({
      priceId: z.string().max(1000),
    })

    const { id } = req.user
    const { priceId } = createCheckoutSessionParamsSchema.parse(req.params)

    const createCheckoutSessionUseCase = container.resolve(
      CreateCheckoutSessionUseCase,
    )
    const { checkoutSessionId } = await createCheckoutSessionUseCase.execute({
      priceId,
      userId: id,
    })

    return res.status(201).json({ checkoutSessionId })
  }
}
