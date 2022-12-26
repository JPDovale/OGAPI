import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IUpdatePersonalityDTO } from '@modules/persons/dtos/IUpdatePersonalityDTO'

import { UpdatePersonalityUseCase } from './UpdatePersonalityUseCase'

export class UpdatePersonalityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, personalityId } = req.body
    const personality = req.body.personality as IUpdatePersonalityDTO

    const updatePersonalityUseCase = container.resolve(UpdatePersonalityUseCase)
    const updatedPerson = await updatePersonalityUseCase.execute(
      id,
      personId,
      personalityId,
      personality,
    )

    return res.status(200).json(updatedPerson)
  }
}
