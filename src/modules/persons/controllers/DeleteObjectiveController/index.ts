import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteObjectiveUseCase } from '@modules/persons/useCases/DeleteObjectiveUseCase'

export class DeleteObjectiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteObjectiveParamsSchema = z.object({
      personId: z.string().uuid(),
      objectiveId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, objectiveId } = deleteObjectiveParamsSchema.parse(
      req.params,
    )

    const deleteObjectiveUseCase = container.resolve(DeleteObjectiveUseCase)
    const response = await deleteObjectiveUseCase.execute({
      userId: id,
      personId,
      objectiveId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
