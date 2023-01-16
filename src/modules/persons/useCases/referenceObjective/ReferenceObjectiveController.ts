import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IReferenceObjectiveDTO } from '@modules/persons/dtos/IReferenceObjectiveDTO'

import { ReferenceObjectiveUseCase } from './ReferenceObjectiveUseCase'

export class ReferenceObjectiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId, refId } = req.body
    const objective = req.body.objective as IReferenceObjectiveDTO
    const referenceObjectiveUseCase = container.resolve(
      ReferenceObjectiveUseCase,
    )

    const personUpdated = await referenceObjectiveUseCase.execute(
      id,
      projectId,
      personId,
      refId,
      objective,
    )

    return res.status(200).json(personUpdated)
  }
}
