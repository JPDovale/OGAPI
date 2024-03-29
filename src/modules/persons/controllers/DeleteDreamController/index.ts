import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteDreamUseCase } from '@modules/persons/useCases/DeleteDreamUseCase'

export class DeleteDreamController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteDreamParamsSchema = z.object({
      personId: z.string().uuid(),
      dreamId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, dreamId } = deleteDreamParamsSchema.parse(req.params)

    const deleteDreamUseCase = container.resolve(DeleteDreamUseCase)
    const response = await deleteDreamUseCase.execute({
      userId: id,
      personId,
      dreamId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
