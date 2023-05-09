import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeletePersonUseCase } from '@modules/persons/useCases/DeletePersonUseCase'

export class DeletePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deletePersonParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId } = deletePersonParamsSchema.parse(req.params)

    const deletePersonUseCase = container.resolve(DeletePersonUseCase)
    await deletePersonUseCase.execute({ userId: id, personId })

    return res.status(204).end()
  }
}
