import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteObjectiveUseCase } from './DeleteObjectiveUseCase'

export class DeleteObjectiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteObjectiveBodySchema = z.object({
      personId: z.string().min(6).max(100),
      objectiveId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { personId, objectiveId } = deleteObjectiveBodySchema.parse(req.body)

    const deleteObjectiveUseCase = container.resolve(DeleteObjectiveUseCase)
    const { person, box } = await deleteObjectiveUseCase.execute(
      id,
      personId,
      objectiveId,
    )

    return res.status(200).json({ person, box })
  }
}
