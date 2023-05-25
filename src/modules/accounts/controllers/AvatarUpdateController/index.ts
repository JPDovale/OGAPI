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

    if (response.error) {
      return res.status(response.error.statusCode).json(responsePartied)
    }

    return res.status(200).json(responsePartied)
  }
}
