import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { parserUserResponse } from '@modules/accounts/responses/parsers/parseUserResponse'
import { GetInfosUseCase } from '@modules/accounts/useCases/GetInfosUseCase'

export class GetInfosController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user

    const getInfosUseCase = container.resolve(GetInfosUseCase)
    const response = await getInfosUseCase.execute({
      userId: id,
    })

    const responsePartied = parserUserResponse(response)

    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(responsePartied)
  }
}
