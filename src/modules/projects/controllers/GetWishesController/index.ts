import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { GetWishesUseCase } from '@modules/projects/useCases/GetWishesUseCase'

export class GetWishesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetWishesControllerParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = GetWishesControllerParamsSchema.parse(req.params)

    const getWishesUseCase = container.resolve(GetWishesUseCase)
    const response = await getWishesUseCase.execute({
      userId: id,
      projectId,
    })

    if (response.error) {
      return res.status(response.error.statusCode).json(response)
    }

    return res.status(200).json(response)
  }
}
