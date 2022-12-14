import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { CreateSessionUseCase } from './CreateSessionUseCase'

export class CreateSessionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body

    const createSessionUseCase = container.resolve(CreateSessionUseCase)

    const session = await createSessionUseCase.execute({
      email,
      password,
    })

    return res.status(200).json({ session })
  }
}
