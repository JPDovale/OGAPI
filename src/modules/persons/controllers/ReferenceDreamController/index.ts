import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferenceDreamUseCase } from '@modules/persons/useCases/ReferenceDreamUseCase'

export class ReferenceDreamController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referenceDreamParamsSchema = z.object({
      personId: z.string().uuid(),
      referenceId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, referenceId } = referenceDreamParamsSchema.parse(
      req.params,
    )

    const referenceDreamUseCase = container.resolve(ReferenceDreamUseCase)
    const response = await referenceDreamUseCase.execute({
      userId: id,
      personId,
      refId: referenceId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 201

    return res.status(responseStatusCode).json(response)
  }
}
