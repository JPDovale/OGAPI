import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IPower } from '@modules/persons/infra/mongoose/entities/Power'

import { CreatePowerUseCase } from './CreatePowersUseCase'

export class CreatePowersController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId } = req.body
    const powers = req.body.powers as IPower[]

    const createPowersUseCase = container.resolve(CreatePowerUseCase)

    const updatedPerson = await createPowersUseCase.execute(
      id,
      projectId,
      personId,
      powers,
    )

    return res.status(201).json(updatedPerson)
  }
}
