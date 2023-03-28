import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteBoxUseCase } from './DeleteBoxUseCase'

export class DeleteBoxController {
  async handle(req: Request, res: Response): Promise<Response> {
    const DeleteBoxParamsSchema = z.object({
      boxId: z.string().min(6).max(100),
    })

    const { boxId } = DeleteBoxParamsSchema.parse(req.params)

    const deleteBoxUseCase = container.resolve(DeleteBoxUseCase)
    await deleteBoxUseCase.execute({ boxId })

    return res.status(204).end()
  }
}
