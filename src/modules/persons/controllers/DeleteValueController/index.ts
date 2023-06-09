import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteValueUseCase } from '@modules/persons/useCases/DeleteValueUseCase'

export class DeleteValuesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteValueParamsSchema = z.object({
      personId: z.string().uuid(),
      valueId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, valueId } = deleteValueParamsSchema.parse(req.params)

    const deleteValuesUseCase = container.resolve(DeleteValueUseCase)
    const response = await deleteValuesUseCase.execute({
      userId: id,
      personId,
      valueId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
