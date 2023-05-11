import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteFearUseCase } from '@modules/persons/useCases/DeleteFearUseCase'

export class DeleteFearController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteFearParamsSchema = z.object({
      personId: z.string().uuid(),
      fearId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, fearId } = deleteFearParamsSchema.parse(req.params)

    const deleteFearUseCase = container.resolve(DeleteFearUseCase)
    await deleteFearUseCase.execute({
      userId: id,
      personId,
      fearId,
    })

    return res.status(204).end()
  }
}
