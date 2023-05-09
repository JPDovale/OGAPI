import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { ListUsersUseCase } from '@modules/accounts/useCases/ListUsersUseCase'

export class ListUsersController {
  async handle(req: Request, res: Response): Promise<Response> {
    const listUsersUseCase = container.resolve(ListUsersUseCase)

    const { users } = await listUsersUseCase.execute()

    return res.status(200).json({ users })
  }
}
