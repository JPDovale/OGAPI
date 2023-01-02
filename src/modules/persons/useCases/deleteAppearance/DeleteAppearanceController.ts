import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { DeleteAppearanceUseCase } from './DeleteAppearanceUseCase'

export class DeleteAppearanceController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, appearanceId } = req.body

    const deleteAppearanceUseCase = container.resolve(DeleteAppearanceUseCase)
    const updatedPerson = await deleteAppearanceUseCase.execute(
      id,
      personId,
      appearanceId,
    )

    return res.status(200).json(updatedPerson)
  }
}
