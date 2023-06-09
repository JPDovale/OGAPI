import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferencePowerUseCase } from '@modules/persons/useCases/ReferencePowerUseCase'

export class ReferencePowerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referencePowerParamsSchema = z.object({
      personId: z.string().uuid(),
      referenceId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, referenceId } = referencePowerParamsSchema.parse(
      req.params,
    )

    const referencePowerUseCase = container.resolve(ReferencePowerUseCase)
    const response = await referencePowerUseCase.execute({
      userId: id,
      personId,
      refId: referenceId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 201

    return res.status(responseStatusCode).json(response)
  }
}
