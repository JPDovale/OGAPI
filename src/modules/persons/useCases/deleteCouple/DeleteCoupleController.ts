import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { DeleteCoupleUseCase } from './DeleteCoupleUseCase'

export class DeleteCoupleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, coupleId } = req.body

    const deleteCoupleUseCase = container.resolve(DeleteCoupleUseCase)
    const updatedPerson = await deleteCoupleUseCase.execute(
      id,
      personId,
      coupleId,
    )

    return res.status(200).json(updatedPerson)
  }
}
