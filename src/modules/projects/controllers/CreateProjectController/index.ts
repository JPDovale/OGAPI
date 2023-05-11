import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateProjectUseCase } from '@modules/projects/useCases/CreateProjectUseCase'

export class CreateProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createProjectBodySchema = z.object({
      name: z.string().min(1).max(200),
      private: z.boolean().optional(),
      type: z.enum(['rpg', 'book', 'gameplay', 'roadMap']),
      password: z.string().max(100).optional(),
    })

    const {
      name,
      private: priv,
      type,
      password,
    } = createProjectBodySchema.parse(req.body)
    const { id } = req.user

    const createProjectUseCase = container.resolve(CreateProjectUseCase)
    await createProjectUseCase.execute({
      userId: id,
      name,
      private: priv,
      type,
      password,
    })

    return res.status(201).end()
  }
}
