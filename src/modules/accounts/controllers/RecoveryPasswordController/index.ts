import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { RecoveryPasswordUseCase } from '@modules/accounts/useCases/RecoveryPasswordUseCase'

export class RecoveryPasswordController {
  async handle(req: Request, res: Response): Promise<Response> {
    const recoveryPasswordBodySchema = z.object({
      password: z.string().min(6).max(200),
      token: z.string().min(6).max(70),
    })

    const { password, token } = recoveryPasswordBodySchema.parse(req.body)

    const recoveryPasswordUseCase = container.resolve(RecoveryPasswordUseCase)
    const response = await recoveryPasswordUseCase.execute({ password, token })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
