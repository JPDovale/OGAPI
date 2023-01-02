import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IObjective } from '@modules/persons/infra/mongoose/entities/Objective'

import { CreateObjectiveUseCase } from './CreateObjectiveUseCase'

export class CreateObjectivesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId } = req.body
    const objectives = req.body.objectives as IObjective[]

    const createObjectiveUseCase = container.resolve(CreateObjectiveUseCase)

    const updatedPerson = await createObjectiveUseCase.execute(
      id,
      projectId,
      personId,
      objectives,
    )

    return res.status(201).json(updatedPerson)
  }
}
