import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IPersonality } from '@modules/persons/infra/mongoose/entities/Personality'

import { CreatePersonalityUseCase } from './CreatePersonalityUseCase'

export class CreatePersonalityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId } = req.body
    const personality = req.body.personality as IPersonality[]

    const createPersonalityUseCase = container.resolve(CreatePersonalityUseCase)
    const updatedPerson = await createPersonalityUseCase.execute(
      personality,
      id,
      projectId,
      personId,
    )

    return res.status(201).json(updatedPerson)
  }
}
