import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreatePersonUseCase } from './CreatePersonUseCase'

export class CreatePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createPersonBodySchema = z.object({
      projectId: z.string().min(6).max(100),
      name: z.string().min(1).max(60),
      lastName: z.string().min(1).max(60),
      history: z
        .string()
        .min(1)
        .max(10000)
        .regex(/^[^<>{}\\]+$/),
      age: z.string().min(1).max(10).regex(/^\d+$/),
    })

    const { id } = req.user
    const { projectId, age, history, lastName, name } =
      createPersonBodySchema.parse(req.body)

    const createPersonUseCase = container.resolve(CreatePersonUseCase)
    const { person, box } = await createPersonUseCase.execute({
      userId: id,
      projectId,
      newPerson: {
        age,
        name,
        lastName,
        history,
      },
    })

    return res.status(201).json({ person, box })
  }
}
