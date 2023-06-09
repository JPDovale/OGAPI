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
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(responsePartied)
  }
}
