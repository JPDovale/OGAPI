import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteWisheUseCase } from '@modules/persons/useCases/DeleteWisheUseCase'

export class DeleteWisheController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteWisheParamsSchema = z.object({
      personId: z.string().uuid(),
      wisheId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, wisheId } = deleteWisheParamsSchema.parse(req.params)

    const deleteWisheUseCase = container.resolve(DeleteWisheUseCase)
    const response = await deleteWisheUseCase.execute({
      userId: id,
      personId,
      wisheId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
