import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteBoxUseCase } from '@modules/boxes/useCases/DeleteBoxUseCase'

export class DeleteBoxController {
  async handle(req: Request, res: Response): Promise<Response> {
    const DeleteBoxParamsSchema = z.object({
      boxId: z.string().uuid(),
    })

    const { id } = req.user
    const { boxId } = DeleteBoxParamsSchema.parse(req.params)

    const deleteBoxUseCase = container.resolve(DeleteBoxUseCase)
    await deleteBoxUseCase.execute({ boxId, userId: id })

    return res.status(204).end()
  }
}
