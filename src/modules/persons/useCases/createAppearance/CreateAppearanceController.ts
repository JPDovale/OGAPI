import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IAppearance } from '@modules/persons/infra/mongoose/entities/Appearance'

import { CreateAppearanceUseCase } from './CreateAppearanceUseCase'

export class CreateAppearancesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId } = req.body
    const appearance = req.body.appearance as IAppearance[]

    const createAppearanceUseCase = container.resolve(CreateAppearanceUseCase)

    const updatedPerson = await createAppearanceUseCase.execute(
      id,
      projectId,
      personId,
      appearance,
    )

    return res.status(201).json(updatedPerson)
  }
}
