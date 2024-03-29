import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferenceWisheUseCase } from '@modules/persons/useCases/ReferenceWisheUseCase'

export class ReferenceWisheController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referenceWisheParamsSchema = z.object({
      personId: z.string().uuid(),
      referenceId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, referenceId } = referenceWisheParamsSchema.parse(
      req.params,
    )

    const referenceWisheUseCase = container.resolve(ReferenceWisheUseCase)
    const response = await referenceWisheUseCase.execute({
      userId: id,
      personId,
      refId: referenceId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 201

    return res.status(responseStatusCode).json(response)
  }
}
