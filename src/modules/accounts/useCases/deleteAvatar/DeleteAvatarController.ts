import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { DeleteAvatarUseCase } from './DeleteAvatarUseCase'

export class DeleteAvatarController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user

    const deleteAvatarUseCase = container.resolve(DeleteAvatarUseCase)
    const newInfosUser = await deleteAvatarUseCase.execute(id)

    return res.status(200).json(newInfosUser)
  }
}
