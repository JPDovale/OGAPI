import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { parserUserResponse } from '@modules/accounts/responses/parsers/parseUserResponse'
import { GetByAccountUserUseCase } from '@modules/accounts/useCases/GetByAccountUserUseCase'

export class GetByAccountUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const reqParamsParser = z.object({
      provider: z.string(),
      providerAccountId: z.string(),
    })

    const { provider, providerAccountId } = reqParamsParser.parse(req.params)

    const getByAccountUserUseCase = container.resolve(GetByAccountUserUseCase)
    const response = await getByAccountUserUseCase.execute({
      provider,
      providerAccountId,
    })
    const responsePartied = parserUserResponse(response)
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(responsePartied)
  }
}
