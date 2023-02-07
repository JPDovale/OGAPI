import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { RecoveryPasswordUseCase } from './RecoveryPasswordUseCase'

export class RecoveryPasswordController {
  async handle(req: Request, res: Response): Promise<Response> {
    const recoveryPasswordBodySchema = z.object({
      password: z.string().min(6).max(200),
      token: z.string().min(6).max(70),
    })

    const { password, token } = recoveryPasswordBodySchema.parse(req.body)

    const recoveryPasswordUseCase = container.resolve(RecoveryPasswordUseCase)
    await recoveryPasswordUseCase.execute({ password, token })

    return res.status(200).json({
      successTitle: 'Senha alterada.',
      successMessage:
        'Você pode continuar sua jornada daqui, nobre viajante. Sempre que se perder pode contar com a gente.',
    })
  }
}
