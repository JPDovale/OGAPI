import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { UpdateImagePersonUseCase } from './UpdateImagePersonUseCase'

export class UpdateImagePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId } = req.params
    const { file } = req

    const imageUpdateUseCase = container.resolve(UpdateImagePersonUseCase)

    const personUpdated = await imageUpdateUseCase.execute(id, personId, file)

    return res.status(200).json(personUpdated)
  }
}
