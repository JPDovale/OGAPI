import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeletePersonUseCase } from './DeletePersonUseCase'

export class DeletePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deletePersonBodySchema = z.object({
      personId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { personId } = deletePersonBodySchema.parse(req.body)

    const deletePersonUseCase = container.resolve(DeletePersonUseCase)
    const { box } = await deletePersonUseCase.execute(id, personId)

    return res
      .status(200)
      .json({ success: 'Personagem deletado com sucesso', box })
  }
}
