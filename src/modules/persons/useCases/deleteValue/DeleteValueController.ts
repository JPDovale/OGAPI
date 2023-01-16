import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { DeleteValueUseCase } from './DeleteValueUseCase'

export class DeleteValuesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { personId, valueId } = req.body

    const deleteValuesUseCase = container.resolve(DeleteValueUseCase)
    const updatedPerson = await deleteValuesUseCase.execute(
      id,
      personId,
      valueId,
    )

    return res.status(200).json(updatedPerson)
  }
}
