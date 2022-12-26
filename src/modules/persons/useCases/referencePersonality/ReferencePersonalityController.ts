import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IReferencePersonalityDTO } from '@modules/persons/dtos/IReferencePersonalityDTO'

import { ReferencePersonalityUseCase } from './ReferencePersonalityUseCase'

export class ReferencePersonalityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId, refId } = req.body
    const personality = req.body.personality as IReferencePersonalityDTO
    const referencePersonalityUseCase = container.resolve(
      ReferencePersonalityUseCase,
    )

    const personUpdated = await referencePersonalityUseCase.execute(
      id,
      projectId,
      personId,
      refId,
      personality,
    )

    return res
      .status(200)
      .json({ message: 'Referencia criada com sucesso', person: personUpdated })
  }
}
