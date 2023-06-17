import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateOAuthAccountUseCase } from '@modules/accounts/useCases/CreateOAuthAccountUseCase'

export class CreateOAuthAccountController {
  async handle(req: Request, res: Response): Promise<Response> {
    const reqBodyParser = z.object({
      userId: z.string(),
      provider: z.string(),
      providerAccountId: z.string(),
      type: z.string(),
      accessToken: z.string(),
      expiresAt: z.number(),
      idToken: z.string(),
      refreshToken: z.string(),
      scope: z.string(),
      sessionState: z.string(),
      tokenType: z.string(),
    })

    const {
      accessToken,
      expiresAt,
      idToken,
      provider,
      providerAccountId,
      refreshToken,
      scope,
      sessionState,
      tokenType,
      type,
      userId,
    } = reqBodyParser.parse(req.body)

    const createOAuthAccountUseCase = container.resolve(
      CreateOAuthAccountUseCase,
    )
    const response = await createOAuthAccountUseCase.execute({
      userId,
      accessToken,
      expiresAt,
      idToken,
      provider,
      providerAccountId,
      refreshToken,
      scope,
      sessionState,
      tokenType,
      type,
    })

    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
