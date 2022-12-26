import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'

import { UpdateWisheUseCase } from './UpdateWisheUseCase'

export class UpdateWisheController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, wisheId } = req.body
    const wishe = req.body.wishe as IUpdateBaseDTO

    const updateWisheUseCase = container.resolve(UpdateWisheUseCase)
    const updatedPerson = await updateWisheUseCase.execute(
      id,
      personId,
      wisheId,
      wishe,
    )

    return res.status(200).json(updatedPerson)
  }
}
