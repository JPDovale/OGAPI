import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateOAuthSessionUseCase } from '@modules/accounts/useCases/CreateOAuthSessionUseCase'

export class CreateOAuthSessionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const reqBodyParser = z.object({
      userId: z.string(),
      expires: z.coerce.date(),
      sessionToken: z.string(),
    })

    const { userId, expires, sessionToken } = reqBodyParser.parse(req.body)

    const createOAuthSessionUseCase = container.resolve(
      CreateOAuthSessionUseCase,
    )
    const response = await createOAuthSessionUseCase.execute({
      userId,
      expires,
      sessionToken,
    })

    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
