import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteAppearanceUseCase } from '@modules/persons/useCases/DeleteAppearanceUseCase'

export class DeleteAppearanceController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteAppearanceParamsSchema = z.object({
      personId: z.string().uuid(),
      appearanceId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, appearanceId } = deleteAppearanceParamsSchema.parse(
      req.params,
    )

    const deleteAppearanceUseCase = container.resolve(DeleteAppearanceUseCase)
    const response = await deleteAppearanceUseCase.execute({
      userId: id,
      personId,
      appearanceId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
