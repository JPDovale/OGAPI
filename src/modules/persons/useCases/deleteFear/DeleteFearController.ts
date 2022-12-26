import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { DeleteFearUseCase } from './DeleteFearUseCase'

export class DeleteFearController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, fearId } = req.body

    const deleteFearUseCase = container.resolve(DeleteFearUseCase)
    await deleteFearUseCase.execute(id, personId, fearId)

    return res.status(200).json({ message: 'Medo deletado' })
  }
}
