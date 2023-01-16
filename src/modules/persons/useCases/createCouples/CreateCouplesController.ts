import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ICouple } from '@modules/persons/infra/mongoose/entities/Couple'

import { CreateCoupleUseCase } from './CreateCouplesUseCase'

export class CreateCouplesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId } = req.body
    const couples = req.body.couples as ICouple[]

    const createCouplesUseCase = container.resolve(CreateCoupleUseCase)

    const updatedPerson = await createCouplesUseCase.execute(
      id,
      projectId,
      personId,
      couples,
    )

    return res.status(201).json(updatedPerson)
  }
}
