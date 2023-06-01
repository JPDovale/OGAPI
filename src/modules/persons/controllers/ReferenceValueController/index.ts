import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferenceValueUseCase } from '@modules/persons/useCases/ReferenceValueUseCase'

export class ReferenceValueController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referenceValueParamsSchema = z.object({
      personId: z.string().uuid(),
      referenceId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, referenceId } = referenceValueParamsSchema.parse(
      req.params,
    )

    const referenceValueUseCase = container.resolve(ReferenceValueUseCase)
    const response = await referenceValueUseCase.execute({
      userId: id,
      personId,
      refId: referenceId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 201

    return res.status(responseStatusCode).json(response)
  }
}
