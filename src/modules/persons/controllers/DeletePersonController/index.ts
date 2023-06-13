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
    const response = await deletePersonUseCase.execute({ userId: id, personId })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
