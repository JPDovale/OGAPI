import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateSessionUseCase } from './CreateSessionUseCase'

export class CreateSessionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createSessionBodySchema = z.object({
      email: z.string().email().max(100),
      password: z.string().max(100),
    })

    const { email, password } = createSessionBodySchema.parse(req.body)

    const createSessionUseCase = container.resolve(CreateSessionUseCase)
    const session = await createSessionUseCase.execute({ email, password })

    return res.status(200).json(session)
  }
}
