import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IUpdateValueDTO } from '@modules/persons/dtos/IUpdateValueDTO'

import { UpdateValueUseCase } from './UpdateValueUseCase'

export class UpdateValueController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, valueId } = req.body
    const value = req.body.value as IUpdateValueDTO

    const updateValueUseCase = container.resolve(UpdateValueUseCase)
    const updatedPerson = await updateValueUseCase.execute(
      id,
      personId,
      valueId,
      value,
    )

    return res.status(200).json(updatedPerson)
  }
}
