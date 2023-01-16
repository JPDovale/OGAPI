import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { DeletePowerUseCase } from './DeletePowerUseCase'

export class DeletePowerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, powerId } = req.body

    const deletePowerUseCase = container.resolve(DeletePowerUseCase)
    const updatedPerson = await deletePowerUseCase.execute(
      id,
      personId,
      powerId,
    )

    return res.status(200).json(updatedPerson)
  }
}
