import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { DeleteWisheUseCase } from './DeleteWisheUseCase'

export class DeleteWisheController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, wisheId } = req.body

    const deleteWisheUseCase = container.resolve(DeleteWisheUseCase)
    const updatedPerson = await deleteWisheUseCase.execute(
      id,
      personId,
      wisheId,
    )

    return res.status(200).json(updatedPerson)
  }
}
