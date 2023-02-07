import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteValueUseCase } from './DeleteValueUseCase'

export class DeleteValuesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteValueBodySchema = z.object({
      personId: z.string().min(6).max(100),
      valueId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { personId, valueId } = deleteValueBodySchema.parse(req.body)

    const deleteValuesUseCase = container.resolve(DeleteValueUseCase)
    const updatedPerson = await deleteValuesUseCase.execute(
      id,
      personId,
      valueId,
    )

    return res.status(200).json(updatedPerson)
  }
}
