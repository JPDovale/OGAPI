import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ITrauma } from '@modules/persons/infra/mongoose/entities/Trauma'

import { CreateTraumaUseCase } from './CreateTraumasUseCase'

export class CreateTraumaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId } = req.body
    const traumas = req.body.traumas as ITrauma[]

    const createTraumaUseCase = container.resolve(CreateTraumaUseCase)
    const updatedPerson = await createTraumaUseCase.execute(
      traumas,
      id,
      projectId,
      personId,
    )

    return res.status(201).json(updatedPerson)
  }
}
