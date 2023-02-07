import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateObjectiveUseCase } from './CreateObjectiveUseCase'

export class CreateObjectivesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createObjectiveBodySchema = z.object({
      projectId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      objective: z.object({
        title: z.string().min(1).max(100),
        description: z
          .string()
          .min(1)
          .max(10000)
          .regex(/^[^<>{}\\]+$/),
        objectified: z.boolean(),
        supporting: z.array(z.string().min(6).max(100)).optional(),
        avoiders: z.array(z.string().min(6).max(100)).optional(),
      }),
    })

    const { id } = req.user
    const {
      projectId,
      personId,
      objective: { title, description, objectified, supporting, avoiders },
    } = createObjectiveBodySchema.parse(req.body)

    const createObjectiveUseCase = container.resolve(CreateObjectiveUseCase)
    const { person, project } = await createObjectiveUseCase.execute({
      userId: id,
      projectId,
      personId,
      objective: {
        title,
        description,
        objectified,
        supporting,
        avoiders,
      },
    })

    return res.status(201).json({ person, project })
  }
}
