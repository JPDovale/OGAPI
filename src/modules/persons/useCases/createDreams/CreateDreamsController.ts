import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IDream } from '@modules/persons/infra/mongoose/entities/Dream'

import { CreateDreamUseCase } from './CreateDreamsUseCase'

export class CreateDreamsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId } = req.body
    const dreams = req.body.dreams as IDream[]

    const createDreamsUseCase = container.resolve(CreateDreamUseCase)

    const updatedPerson = await createDreamsUseCase.execute(
      id,
      projectId,
      personId,
      dreams,
    )

    return res.status(201).json(updatedPerson)
  }
}
