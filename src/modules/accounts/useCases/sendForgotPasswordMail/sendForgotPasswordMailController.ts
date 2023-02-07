import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { AppError } from '@shared/errors/AppError'

import { SendForgotPasswordMailUseCase } from './sendForgotPasswordMailUseCase'

export class SendForgotPasswordMailController {
  async handle(req: Request, res: Response): Promise<Response> {
    const sendForgotMailPasswordBodySchema = z.object({
      email: z.string().email().max(200),
    })

    const { email } = sendForgotMailPasswordBodySchema.parse(req.body)

    const sendForgotPasswordMailUseCase = container.resolve(
      SendForgotPasswordMailUseCase,
    )
    await sendForgotPasswordMailUseCase.execute(email)

    return res.status(200).json({
      successTitle: 'Email enviado.',
      successMessage: 'Um email de recuperação de senha foi enviado para você.',
    })
  }
}