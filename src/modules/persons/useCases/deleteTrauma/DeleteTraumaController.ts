import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteTraumaUseCase } from './DeleteTraumaUseCase'

export class DeleteTraumaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteTraumaBodySchema = z.object({
      personId: z.string().min(6).max(100),
      traumaId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { personId, traumaId } = deleteTraumaBodySchema.parse(req.body)

    const deleteTraumaUseCase = container.resolve(DeleteTraumaUseCase)
    await deleteTraumaUseCase.execute(id, personId, traumaId)

    return res
      .status(200)
      .json({ success: 'Característica de personalidade deletada' })
  }
}
