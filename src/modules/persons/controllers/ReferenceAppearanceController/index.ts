import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferenceAppearanceUseCase } from '@modules/persons/useCases/ReferenceAppearanceUseCase'

export class ReferenceAppearanceController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referenceAppearanceParamsSchema = z.object({
      personId: z.string().uuid(),
      referenceId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, referenceId } = referenceAppearanceParamsSchema.parse(
      req.params,
    )

    const referenceAppearanceUseCase = container.resolve(
      ReferenceAppearanceUseCase,
    )
    const response = await referenceAppearanceUseCase.execute({
      userId: id,
      personId,
      refId: referenceId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 201

    return res.status(responseStatusCode).json(response)
  }
}
