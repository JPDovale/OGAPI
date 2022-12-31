import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'

import { UpdateAppearanceUseCase } from './UpdateAppearanceUseCase'

export class UpdateAppearanceController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, appearanceId } = req.body
    const appearance = req.body.appearance as IUpdateBaseDTO

    const updateAppearanceUseCase = container.resolve(UpdateAppearanceUseCase)
    const updatedPerson = await updateAppearanceUseCase.execute(
      id,
      personId,
      appearanceId,
      appearance,
    )

    return res.status(200).json(updatedPerson)
  }
}
