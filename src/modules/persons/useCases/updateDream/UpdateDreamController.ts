import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'

import { UpdateDreamUseCase } from './UpdateDreamUseCase'

export class UpdateDreamController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, dreamId } = req.body
    const dream = req.body.dream as IUpdateBaseDTO

    const updateDreamUseCase = container.resolve(UpdateDreamUseCase)
    const updatedPerson = await updateDreamUseCase.execute(
      id,
      personId,
      dreamId,
      dream,
    )

    return res.status(200).json(updatedPerson)
  }
}
