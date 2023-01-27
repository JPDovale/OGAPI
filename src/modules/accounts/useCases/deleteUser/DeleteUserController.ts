import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteUserUseCase } from './DeleteUserUseCase'

export class DeleteUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteUserParamsSchema = z.object({
      id: z.string().max(100).optional(),
    })

    const { user } = req
    const { id } = deleteUserParamsSchema.parse(req.params)

    const deleteUserUseCase = container.resolve(DeleteUserUseCase)

    await deleteUserUseCase.execute(id || user.id)

    return res.status(202).json({ success: 'User deleted' })
  }
}
