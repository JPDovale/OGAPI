import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeletePersonalityUseCase } from './DeletePersonalityUseCase'

export class DeletePersonalityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deletePersonalityBodySchema = z.object({
      personId: z.string().min(6).max(100),
      personalityId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { personId, personalityId } = deletePersonalityBodySchema.parse(
      req.body,
    )

    const deletePersonalityUseCase = container.resolve(DeletePersonalityUseCase)
    const updatedPeron = await deletePersonalityUseCase.execute(
      id,
      personId,
      personalityId,
    )

    return res.status(200).json(updatedPeron)
  }
}
