import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreatePersonUseCase } from '@modules/persons/useCases/CreatePersonUseCase'

export class CreatePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createPersonParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const createPersonBodySchema = z.object({
      name: z.string().min(1).max(60),
      lastName: z.string().min(1).max(60),
      history: z
        .string()
        .min(1)
        .max(10000)
        .regex(/^[^<>{}\\]+$/),
      age: z.number(),
    })

    const { id } = req.user
    const { projectId } = createPersonParamsSchema.parse(req.params)
    const { age, history, lastName, name } = createPersonBodySchema.parse(
      req.body,
    )

    const createPersonUseCase = container.resolve(CreatePersonUseCase)
    const { person } = await createPersonUseCase.execute({
      userId: id,
      projectId,
      age,
      name,
      lastName,
      history,
    })

    return res.status(201).json({ person })
  }
}
