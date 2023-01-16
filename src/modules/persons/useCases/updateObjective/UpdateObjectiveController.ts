import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IUpdateObjectiveDTO } from '@modules/persons/dtos/IUpdateObjectiveDTO'

import { UpdateObjectiveUseCase } from './UpdateObjectiveUseCase'

export class UpdateObjectiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, objectiveId } = req.body
    const objective = req.body.objective as IUpdateObjectiveDTO

    const updateObjectiveUseCase = container.resolve(UpdateObjectiveUseCase)
    const updatedPerson = await updateObjectiveUseCase.execute(
      id,
      personId,
      objectiveId,
      objective,
    )

    return res.status(200).json(updatedPerson)
  }
}
