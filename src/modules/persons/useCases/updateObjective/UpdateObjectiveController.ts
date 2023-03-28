import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateObjectiveUseCase } from './UpdateObjectiveUseCase'

export class UpdateObjectiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateObjectiveBodySchema = z.object({
      objectiveId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      objective: z.object({
        title: z.string().max(100).optional(),
        description: z
          .string()

          .max(10000)
          .regex(/^[^<>{}\\]+$/)
          .optional(),
        objectified: z.boolean().optional(),
        supporting: z.array(z.string().min(6).max(100)).optional(),
        avoiders: z.array(z.string().min(6).max(100)).optional(),
      }),
    })

    const { id } = req.user
    const { personId, objectiveId, objective } =
      updateObjectiveBodySchema.parse(req.body)

    const updateObjectiveUseCase = container.resolve(UpdateObjectiveUseCase)
    const updatedPerson = await updateObjectiveUseCase.execute(
      id,
      personId,
      objectiveId,
      objective,
    )

    return res.status(200).json(updatedPerson)
  }
}
