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

    const responseStatusCode = response.error ? response.error.statusCode : 201

    return res.status(responseStatusCode).json(responsePartied)
  }
}
