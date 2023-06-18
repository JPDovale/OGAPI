import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { parserUserResponse } from '@modules/accounts/responses/parsers/parseUserResponse'
import { GetSessionAndUserUseCase } from '@modules/accounts/useCases/GetSessionAndUserUseCase'

export class GetSessionAndUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const reqParamsParser = z.object({
      sessionToken: z.string(),
    })

    const { sessionToken } = reqParamsParser.parse(req.params)

    const getSessionAndUserUseCase = container.resolve(GetSessionAndUserUseCase)
    const response = await getSessionAndUserUseCase.execute({
      sessionToken,
    })
    const responsePartied = parserUserResponse(response)
    const responseStatusCode = response.error ? response.error.statusCode : 200

    res.cookie('@og-token', response.data?.token, {
      maxAge: 1000 * 60 * 10, // 10 min
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    })

    res.cookie('@og-refresh-token', response.data?.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    })

    return res.status(responseStatusCode).json(responsePartied)
  }
}
