import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferenceTraumaUseCase } from '@modules/persons/useCases/ReferenceTraumaUseCase'

export class ReferenceTraumaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referenceTraumaParamsSchema = z.object({
      personId: z.string().uuid(),
      referenceId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, referenceId } = referenceTraumaParamsSchema.parse(
      req.params,
    )

    const referenceTraumaUseCase = container.resolve(ReferenceTraumaUseCase)
    const response = await referenceTraumaUseCase.execute({
      userId: id,
      personId,
      refId: referenceId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 201

    return res.status(responseStatusCode).json(response)
  }
}
