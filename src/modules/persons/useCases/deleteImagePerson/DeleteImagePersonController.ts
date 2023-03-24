import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteImagePersonUseCase } from './DeleteImagePersonUseCase'

export class DeleteImagePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteImagePersonBodySchema = z.object({
      personId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { personId } = deleteImagePersonBodySchema.parse(req.params)

    const deleteImagePersonUseCase = container.resolve(DeleteImagePersonUseCase)
    const updatedPerson = await deleteImagePersonUseCase.execute(id, personId)

    return res.status(200).json(updatedPerson)
  }
}
