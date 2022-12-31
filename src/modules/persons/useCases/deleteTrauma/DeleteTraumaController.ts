import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { DeleteTraumaUseCase } from './DeleteTraumaUseCase'

export class DeleteTraumaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, traumaId } = req.body

    const deleteTraumaUseCase = container.resolve(DeleteTraumaUseCase)
    await deleteTraumaUseCase.execute(id, personId, traumaId)

    return res
      .status(200)
      .json({ message: 'Característica de personalidade deletada' })
  }
}
