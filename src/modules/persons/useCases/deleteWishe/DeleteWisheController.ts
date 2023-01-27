import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteWisheUseCase } from './DeleteWisheUseCase'

export class DeleteWisheController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteWisheBodySchema = z.object({
      personId: z.string().min(6).max(100),
      wisheId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { personId, wisheId } = deleteWisheBodySchema.parse(req.body)

    const deleteWisheUseCase = container.resolve(DeleteWisheUseCase)
    const updatedPerson = await deleteWisheUseCase.execute(
      id,
      personId,
      wisheId,
    )

    return res.status(200).json(updatedPerson)
  }
}
