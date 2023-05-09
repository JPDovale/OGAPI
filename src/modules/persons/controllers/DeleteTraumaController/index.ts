import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteTraumaUseCase } from '@modules/persons/useCases/DeleteTraumaUseCase'

export class DeleteTraumaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteTraumaParamsSchema = z.object({
      personId: z.string().uuid(),
      traumaId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, traumaId } = deleteTraumaParamsSchema.parse(req.params)

    const deleteTraumaUseCase = container.resolve(DeleteTraumaUseCase)
    await deleteTraumaUseCase.execute({
      userId: id,
      personId,
      traumaId,
    })

    return res.status(204).end()
  }
}
