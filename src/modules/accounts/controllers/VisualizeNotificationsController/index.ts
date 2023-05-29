import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { parserUserResponse } from '@modules/accounts/responses/parsers/parseUserResponse'
import { VisualizeNotificationsUseCase } from '@modules/accounts/useCases/VisualizeNotificationsUseCase'

export class VisualizeNotificationsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user

    const visualizeNotificationsUseCase = container.resolve(
      VisualizeNotificationsUseCase,
    )
    const response = await visualizeNotificationsUseCase.execute({ userId: id })
    const responsePartied = parserUserResponse(response)

    if (response.error) {
      return res.status(response.error.statusCode).json(responsePartied)
    }

    return res.status(200).json(responsePartied)
  }
}
