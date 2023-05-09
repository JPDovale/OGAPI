import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteUserUseCase } from '@modules/accounts/useCases/DeleteUserUseCase'

export class DeleteUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteUserParamsSchema = z.object({
      id: z.string().uuid().optional(),
    })

    const { user } = req
    const { id } = deleteUserParamsSchema.parse(req.params)

    const deleteUserUseCase = container.resolve(DeleteUserUseCase)

    await deleteUserUseCase.execute({ userId: id ?? user.id })

    return res.status(202).json({ successMessage: 'User deleted' })
  }
}
