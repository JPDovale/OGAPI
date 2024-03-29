import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteImagePersonUseCase } from '@modules/persons/useCases/DeleteImagePersonUseCase'

export class DeleteImagePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteImagePersonParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId } = deleteImagePersonParamsSchema.parse(req.params)

    const deleteImagePersonUseCase = container.resolve(DeleteImagePersonUseCase)
    const response = await deleteImagePersonUseCase.execute({
      userId: id,
      personId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(responseStatusCode)
  }
}
