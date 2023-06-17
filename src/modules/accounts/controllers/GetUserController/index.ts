import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { parserUserResponse } from '@modules/accounts/responses/parsers/parseUserResponse'
import { GetUserUseCase } from '@modules/accounts/useCases/GetUserUseCase'

export class GetUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const reqParamsParser = z.object({
      id: z.string().uuid(),
    })

    const { id } = reqParamsParser.parse(req.params)

    const getUserUseCase = container.resolve(GetUserUseCase)
    const response = await getUserUseCase.execute({
      id,
    })
    const responsePartied = parserUserResponse(response)
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(responsePartied)
  }
}
