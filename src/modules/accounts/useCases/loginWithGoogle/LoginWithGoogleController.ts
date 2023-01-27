import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { LoginWithGoogleUseCase } from './LoginWithGoogleUseCase'

export class LoginWithGoogleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const loginWithGoogleBodySchema = z.object({
      name: z.string().max(200).optional(),
      email: z.string().email().max(100).optional(),
      image: z.string().max(500).optional(),
    })

    const { name, email, image } = loginWithGoogleBodySchema.parse(req.body)

    const loginWithGoogleUseCase = container.resolve(LoginWithGoogleUseCase)
    const session = await loginWithGoogleUseCase.execute({
      email,
      image,
      name,
    })

    return res.status(201).json(session)
  }
}
