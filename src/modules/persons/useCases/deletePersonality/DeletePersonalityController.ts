import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { DeletePersonalityUseCase } from './DeletePersonalityUseCase'

export class DeletePersonalityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, personalityId } = req.body

    const deletePersonalityUseCase = container.resolve(DeletePersonalityUseCase)
    await deletePersonalityUseCase.execute(id, personId, personalityId)

    return res
      .status(200)
      .json({ success: 'Característica de personalidade deletada' })
  }
}
