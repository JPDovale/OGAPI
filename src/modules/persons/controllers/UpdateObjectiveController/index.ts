import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateObjectiveUseCase } from '@modules/persons/useCases/UpdateObjectiveUseCase'

export class UpdateObjectiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateObjectiveParamsSchema = z.object({
      objectiveId: z.string().uuid(),
      personId: z.string().uuid(),
    })

    const updateObjectiveBodySchema = z.object({
      title: z.string().max(100).optional(),
      description: z
        .string()
        .max(10000)
        .regex(/^[^<>{}\\]+$/)
        .optional(),
      itBeRealized: z.boolean().optional(),
    })

    const { id } = req.user
    const { objectiveId, personId } = updateObjectiveParamsSchema.parse(
      req.params,
    )
    const { description, itBeRealized, title } =
      updateObjectiveBodySchema.parse(req.body)

    const updateObjectiveUseCase = container.resolve(UpdateObjectiveUseCase)
    const { objective } = await updateObjectiveUseCase.execute({
      userId: id,
      personId,
      objectiveId,
      description,
      itBeRealized,
      title,
    })

    return res.status(200).json({ objective })
  }
}
