import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ChangeFeaturesUsingUseCase } from '@modules/projects/useCases/ChangeFeaturesUsingUseCase'
import { validadeInputFeatures } from '@utils/application/validation/projects/validateInputFeatures'

export class ChangeFeaturesUsingController {
  async handle(req: Request, res: Response): Promise<Response> {
    const changeFeaturesUsingParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const changeFeaturesUsingBodySchema = z.object({
      features: validadeInputFeatures,
    })

    const { id } = req.user
    const { projectId } = changeFeaturesUsingParamsSchema.parse(req.params)
    const { features } = changeFeaturesUsingBodySchema.parse(req.body)

    const changeFeaturesUsingUseCase = container.resolve(
      ChangeFeaturesUsingUseCase,
    )
    await changeFeaturesUsingUseCase.execute({
      userId: id,
      projectId,
      features,
    })

    return res.status(204).end()
  }
}
