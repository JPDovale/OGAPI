import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeletePersonalityUseCase } from '@modules/persons/useCases/DeletePersonalityUseCase'

export class DeletePersonalityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deletePersonalityParamsSchema = z.object({
      personId: z.string().uuid(),
      personalityId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, personalityId } = deletePersonalityParamsSchema.parse(
      req.body,
    )

    const deletePersonalityUseCase = container.resolve(DeletePersonalityUseCase)
    await deletePersonalityUseCase.execute({
      userId: id,
      personId,
      personalityId,
    })

    return res.status(204).end()
  }
}
