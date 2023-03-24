import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { GetInfosUseCase } from './GetInfosUseCase'

export class GetInfosController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user

    const getInfosUseCase = container.resolve(GetInfosUseCase)
    const user = await getInfosUseCase.execute(id)

    return res.status(200).json(user)
  }
}
