import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IFear } from '@modules/persons/infra/mongoose/entities/Fear'

import { CreateFearUseCase } from './CreateFearsUseCase'

export class CreateFearsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId } = req.body
    const fears = req.body.fears as IFear[]

    const createFearsUseCase = container.resolve(CreateFearUseCase)

    const updatedPerson = await createFearsUseCase.execute(
      id,
      projectId,
      personId,
      fears,
    )

    return res.status(201).json(updatedPerson)
  }
}
