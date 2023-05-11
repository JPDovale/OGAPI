import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteCoupleUseCase } from '@modules/persons/useCases/DeleteCoupleUseCase'

export class DeleteCoupleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteCoupleParamsSchema = z.object({
      personId: z.string().uuid(),
      coupleId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, coupleId } = deleteCoupleParamsSchema.parse(req.params)

    const deleteCoupleUseCase = container.resolve(DeleteCoupleUseCase)
    await deleteCoupleUseCase.execute({
      userId: id,
      personId,
      coupleId,
    })

    return res.status(204).end()
  }
}
