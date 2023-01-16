import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { DeleteDreamUseCase } from './DeleteDreamUseCase'

export class DeleteDreamController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, dreamId } = req.body

    const deleteDreamUseCase = container.resolve(DeleteDreamUseCase)
    const updatedPerson = await deleteDreamUseCase.execute(
      id,
      personId,
      dreamId,
    )

    return res.status(200).json(updatedPerson)
  }
}
