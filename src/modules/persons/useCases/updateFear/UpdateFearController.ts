import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'

import { UpdateFearUseCase } from './UpdateFearUseCase'

export class UpdateFearController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, fearId } = req.body
    const fear = req.body.fear as IUpdateBaseDTO

    const updateFearUseCase = container.resolve(UpdateFearUseCase)
    const updatedPerson = await updateFearUseCase.execute(
      id,
      personId,
      fearId,
      fear,
    )

    return res.status(200).json(updatedPerson)
  }
}
