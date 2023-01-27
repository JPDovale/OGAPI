import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateImagePersonUseCase } from './UpdateImagePersonUseCase'

export class UpdateImagePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateImagePersonParamsSchema = z.object({
      personId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { personId } = updateImagePersonParamsSchema.parse(req.params)
    const { file } = req

    const imageUpdateUseCase = container.resolve(UpdateImagePersonUseCase)

    const personUpdated = await imageUpdateUseCase.execute(id, personId, file)

    return res.status(200).json(personUpdated)
  }
}
