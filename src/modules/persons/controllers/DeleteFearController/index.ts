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
    const response = await deleteFearUseCase.execute({
      userId: id,
      personId,
      fearId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
