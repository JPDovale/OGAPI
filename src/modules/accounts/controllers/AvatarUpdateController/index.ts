import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { parserUserResponse } from '@modules/accounts/responses/parsers/parseUserResponse'
import { AvatarUpdateUseCase } from '@modules/accounts/useCases/AvatarUpdateUseCase'

export class AvatarUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const file = req.file

    const avatarUpdateUseCase = container.resolve(AvatarUpdateUseCase)
    const response = await avatarUpdateUseCase.execute({ file, userId: id })

    const responsePartied = parserUserResponse(response)

    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(responsePartied)
  }
}
