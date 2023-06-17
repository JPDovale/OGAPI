import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { parserUserResponse } from '@modules/accounts/responses/parsers/parseUserResponse'
import { GetByEmailUserUseCase } from '@modules/accounts/useCases/GetByEmailUserUseCase'

export class GetByEmailUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const reqParamsParser = z.object({
      email: z.string().email().optional(),
    })

    const { email } = reqParamsParser.parse(req.params)

    const getByEmailUserUseCase = container.resolve(GetByEmailUserUseCase)
    const response = await getByEmailUserUseCase.execute({
      email: email ?? '',
    })
    const responsePartied = parserUserResponse(response)
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(responsePartied)
  }
}
