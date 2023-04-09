import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { VisualizeNotificationsUseCase } from '@modules/accounts/useCases/VisualizeNotificationsUseCase'

export class VisualizeNotificationsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user

    const visualizeNotificationsUseCase = container.resolve(
      VisualizeNotificationsUseCase,
    )
    const { user } = await visualizeNotificationsUseCase.execute({ userId: id })

    return res.status(200).json({ user })
  }
}
