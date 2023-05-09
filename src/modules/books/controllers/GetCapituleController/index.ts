import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { GetCapituleUseCase } from '@modules/books/useCases/GetCapituleUseCase'

export class GetCapituleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetCapituleControllerParamsSchema = z.object({
      capituleId: z.string().uuid(),
    })

    const { id } = req.user
    const { capituleId } = GetCapituleControllerParamsSchema.parse(req.params)

    const getCapituleUseCase = container.resolve(GetCapituleUseCase)
    const { capitule } = await getCapituleUseCase.execute({
      capituleId,
      userId: id,
    })

    return res.status(200).json({ capitule })
  }
}
