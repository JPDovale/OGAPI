import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IReferenceValueDTO } from '@modules/persons/dtos/IReferenceValueDTO'

import { ReferenceValueUseCase } from './ReferenceValueUseCase'

export class ReferenceValueController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId, refId } = req.body
    const value = req.body.value as IReferenceValueDTO
    const referenceValueUseCase = container.resolve(ReferenceValueUseCase)

    const personUpdated = await referenceValueUseCase.execute(
      id,
      projectId,
      personId,
      refId,
      value,
    )

    return res.status(200).json(personUpdated)
  }
}
