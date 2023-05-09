import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferenceFearUseCase } from '@modules/persons/useCases/ReferenceFearUseCase'

export class ReferenceFearController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referenceFearParamsSchema = z.object({
      personId: z.string().uuid(),
      referenceId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, referenceId } = referenceFearParamsSchema.parse(
      req.params,
    )

    const referenceFerUseCase = container.resolve(ReferenceFearUseCase)
    await referenceFerUseCase.execute({
      userId: id,
      personId,
      refId: referenceId,
    })

    return res.status(201).end()
  }
}
