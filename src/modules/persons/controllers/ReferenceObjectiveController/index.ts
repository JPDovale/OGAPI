import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferenceObjectiveUseCase } from '@modules/persons/useCases/ReferenceObjectiveUseCase'

export class ReferenceObjectiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referenceObjectiveParamsSchema = z.object({
      personId: z.string().uuid(),
      referenceId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, referenceId } = referenceObjectiveParamsSchema.parse(
      req.params,
    )

    const referenceObjectiveUseCase = container.resolve(
      ReferenceObjectiveUseCase,
    )
    const response = await referenceObjectiveUseCase.execute({
      userId: id,
      personId,
      refId: referenceId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 201

    return res.status(responseStatusCode).json(response)
  }
}
