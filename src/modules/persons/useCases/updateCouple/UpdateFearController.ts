import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'

import { UpdateCoupleUseCase } from './UpdateCoupleUseCase'

export class UpdateCoupleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, coupleId } = req.body
    const couple = req.body.couple as IUpdateBaseDTO

    const updateCoupleUseCase = container.resolve(UpdateCoupleUseCase)
    const updatedPerson = await updateCoupleUseCase.execute(
      id,
      personId,
      coupleId,
      couple,
    )

    return res.status(200).json(updatedPerson)
  }
}
