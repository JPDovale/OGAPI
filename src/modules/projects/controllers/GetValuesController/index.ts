import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { GetValuesUseCase } from '@modules/projects/useCases/GetValuesUseCase'

export class GetValuesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetValuesControllerParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = GetValuesControllerParamsSchema.parse(req.params)

    const getValuesUseCase = container.resolve(GetValuesUseCase)
    const response = await getValuesUseCase.execute({
      userId: id,
      projectId,
    })

    if (response.error) {
      return res.status(response.error.statusCode).json(response)
    }

    return res.status(200).json(response)
  }
}
