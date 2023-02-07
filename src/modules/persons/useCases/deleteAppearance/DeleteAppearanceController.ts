import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteAppearanceUseCase } from './DeleteAppearanceUseCase'

export class DeleteAppearanceController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteAppearanceBodySchema = z.object({
      personId: z.string().min(6).max(100),
      appearanceId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { personId, appearanceId } = deleteAppearanceBodySchema.parse(
      req.body,
    )

    const deleteAppearanceUseCase = container.resolve(DeleteAppearanceUseCase)
    const updatedPerson = await deleteAppearanceUseCase.execute(
      id,
      personId,
      appearanceId,
    )

    return res.status(200).json(updatedPerson)
  }
}
