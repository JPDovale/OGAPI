import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IReferenceTraumaDTO } from '@modules/persons/dtos/IReferenceTraumaDTO'

import { ReferenceTraumaUseCase } from './ReferenceTraumaUseCase'

export class ReferenceTraumaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId, refId } = req.body
    const trauma = req.body.trauma as IReferenceTraumaDTO
    const referenceTraumaUseCase = container.resolve(ReferenceTraumaUseCase)

    const personUpdated = await referenceTraumaUseCase.execute(
      id,
      projectId,
      personId,
      refId,
      trauma,
    )

    return res.status(200).json(personUpdated)
  }
}
