import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { GetAllPersonsUseCase } from './GetAllPersonsUseCase'

export class GetAllPersonsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user

    const getAllPersonsUseCase = container.resolve(GetAllPersonsUseCase)
    const allPersonsThisUser = await getAllPersonsUseCase.execute(id)

    return res.status(200).json(allPersonsThisUser)
  }
}
