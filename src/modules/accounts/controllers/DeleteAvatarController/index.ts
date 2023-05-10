import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { DeleteAvatarUseCase } from '@modules/accounts/useCases/DeleteAvatarUseCase'

export class DeleteAvatarController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user

    const deleteAvatarUseCase = container.resolve(DeleteAvatarUseCase)
    const { user } = await deleteAvatarUseCase.execute({ userId: id })

    return res.status(200).json({ user })
  }
}