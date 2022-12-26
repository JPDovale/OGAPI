import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { DeleteWisheUseCase } from './DeleteWisheUseCase'

export class DeleteWisheController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, WisheId } = req.body

    const deleteWisheUseCase = container.resolve(DeleteWisheUseCase)
    await deleteWisheUseCase.execute(id, personId, WisheId)

    return res.status(200).json({ message: 'Medo deletado' })
  }
}
