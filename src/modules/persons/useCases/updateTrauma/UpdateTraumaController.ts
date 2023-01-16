import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IUpdateTraumaDTO } from '@modules/persons/dtos/IUpdateTraumaDTO'

import { UpdateTraumaUseCase } from './UpdateTraumaUseCase'

export class UpdateTraumaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, traumaId } = req.body
    const trauma = req.body.trauma as IUpdateTraumaDTO

    const updateTraumaUseCase = container.resolve(UpdateTraumaUseCase)
    const updatedPerson = await updateTraumaUseCase.execute(
      id,
      personId,
      traumaId,
      trauma,
    )

    return res.status(200).json(updatedPerson)
  }
}
