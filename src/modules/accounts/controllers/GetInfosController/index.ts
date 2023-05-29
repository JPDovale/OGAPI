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

    if (response.error) {
      return res.status(response.error.statusCode).json(responsePartied)
    }

    return res.status(200).json(responsePartied)
  }
}
