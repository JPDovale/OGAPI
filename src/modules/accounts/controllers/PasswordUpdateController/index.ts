import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { PasswordUpdateUseCase } from '@modules/accounts/useCases/PasswordUpdateUseCase'

export class PasswordUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const passwordUpdateBodySchema = z.object({
      password: z.string().min(6).max(200),
      oldPassword: z.string().min(6).max(200),
    })

    const { id } = req.user
    const { oldPassword, password } = passwordUpdateBodySchema.parse(req.body)

    const updatePasswordUseCase = container.resolve(PasswordUpdateUseCase)
    const response = await updatePasswordUseCase.execute({
      id,
      oldPassword,
      password,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
