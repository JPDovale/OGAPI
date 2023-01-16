import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'

import { UpdatePowerUseCase } from './UpdatePowerUseCase'

export class UpdatePowerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, powerId } = req.body
    const power = req.body.power as IUpdateBaseDTO

    const updatePowerUseCase = container.resolve(UpdatePowerUseCase)
    const updatedPerson = await updatePowerUseCase.execute(
      id,
      personId,
      powerId,
      power,
    )

    return res.status(200).json(updatedPerson)
  }
}
