import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { DeleteObjectiveUseCase } from './DeleteObjectiveUseCase'

export class DeleteObjectiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, objectiveId } = req.body

    const deleteObjectiveUseCase = container.resolve(DeleteObjectiveUseCase)
    await deleteObjectiveUseCase.execute(id, personId, objectiveId)

    return res.status(200).json({ message: 'Objetivo deletado' })
  }
}
