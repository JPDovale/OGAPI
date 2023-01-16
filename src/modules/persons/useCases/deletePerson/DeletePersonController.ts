import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { DeletePersonUseCase } from './DeletePersonUseCase'

export class DeletePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId } = req.body

    const deletePersonUseCase = container.resolve(DeletePersonUseCase)
    await deletePersonUseCase.execute(id, personId)

    return res.status(200).json({ success: 'Personagem deletado com sucesso' })
  }
}
