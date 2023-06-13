import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z, ZodError } from 'zod'

import { CreateProjectUseCase } from '@modules/projects/useCases/CreateProjectUseCase'
import { validadeInputFeatures } from '@utils/application/validation/projects/validateInputFeatures'

export class CreateProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createProjectBodySchema = z.object({
      name: z.string().min(1).max(200),
      private: z.boolean().optional(),
      type: z.enum(['rpg', 'book', 'gameplay', 'roadMap']),
      password: z.string().max(100).optional(),
      features: validadeInputFeatures,
      timeLine: z
        .object({
          initialDate: z.number(),
          timeChrist: z.enum(['A.C.', 'D.C.']),
        })
        .optional()
        .nullable(),
    })

    const {
      name,
      private: priv,
      type,
      password,
      features,
      timeLine,
    } = createProjectBodySchema.parse(req.body)
    const { id } = req.user

    if (features.timeLines && !timeLine) {
      throw new ZodError([])
    }

    const createProjectUseCase = container.resolve(CreateProjectUseCase)
    const response = await createProjectUseCase.execute({
      userId: id,
      name,
      private: priv,
      type,
      password,
      features,
      timeLine: timeLine ?? undefined,
    })

    if (response.error) {
      return res.status(response.error.statusCode).json(response)
    }

    return res.status(201).json(response)
  }
}
