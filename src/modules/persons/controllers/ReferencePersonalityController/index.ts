import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferencePersonalityUseCase } from '@modules/persons/useCases/ReferencePersonalityUseCase'

export class ReferencePersonalityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referencePersonalityParamsSchema = z.object({
      personId: z.string().uuid(),
      referenceId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, referenceId } = referencePersonalityParamsSchema.parse(
      req.params,
    )

    const referencePersonalityUseCase = container.resolve(
      ReferencePersonalityUseCase,
    )
    await referencePersonalityUseCase.execute({
      userId: id,
      personId,
      refId: referenceId,
    })

    return res.status(201).end()
  }
}
