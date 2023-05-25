import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { parserUserResponse } from '@modules/accounts/responses/parsers/parseUserResponse'
import { DeleteAvatarUseCase } from '@modules/accounts/useCases/DeleteAvatarUseCase'

export class DeleteAvatarController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user

    const deleteAvatarUseCase = container.resolve(DeleteAvatarUseCase)
    const response = await deleteAvatarUseCase.execute({ userId: id })

    const responsePartied = parserUserResponse(response)

    if (response.error) {
      return res.status(response.error.statusCode).json(responsePartied)
    }

    return res.status(200).json(responsePartied)
  }
}
