import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateObjectiveUseCase } from '@modules/persons/useCases/CreateObjectiveUseCase'

export class CreateObjectiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createObjectiveParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const createObjectiveBodySchema = z.object({
      title: z.string().min(1).max(100),
      description: z
        .string()
        .min(1)
        .max(10000)
        .regex(/^[^<>{}\\]+$/),
      itBeRealized: z.boolean(),
      supporters: z
        .array(
          z.object({
            id: z.string().uuid(),
          }),
        )
        .optional(),
      avoiders: z
        .array(
          z.object({
            id: z.string().uuid(),
          }),
        )
        .optional(),
    })

    const { id } = req.user
    const { personId } = createObjectiveParamsSchema.parse(req.params)
    const { title, description, itBeRealized, supporters, avoiders } =
      createObjectiveBodySchema.parse(req.body)

    const createObjectiveUseCase = container.resolve(CreateObjectiveUseCase)
    const { objective } = await createObjectiveUseCase.execute({
      userId: id,
      personId,
      title,
      description,
      itBeRealized,
      supporters,
      avoiders,
    })

    return res.status(201).json({ objective })
  }
}
