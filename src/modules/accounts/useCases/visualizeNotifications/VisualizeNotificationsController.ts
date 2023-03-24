import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { VisualizeNotificationsUseCase } from './VisualizeNotificationsUseCase'

export class VisualizeNotificationsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user

    const visualizeNotificationsUseCase = container.resolve(
      VisualizeNotificationsUseCase,
    )
    const updatedUser = await visualizeNotificationsUseCase.execute(id)

    return res.status(200).json(updatedUser)
  }
}
