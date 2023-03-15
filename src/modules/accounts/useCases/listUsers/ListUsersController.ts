import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { ListUsersUseCase } from './ListUsersUseCase'

export class ListUsersController {
  async handle(req: Request, res: Response): Promise<Response> {
    const listUsersUseCase = container.resolve(ListUsersUseCase)

    const allUsers = await listUsersUseCase.execute()

    return res.status(200).json(allUsers)
  }
}
