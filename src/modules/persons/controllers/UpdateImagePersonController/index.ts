import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateImagePersonUseCase } from '@modules/persons/useCases/UpdateImagePersonUseCase'

export class UpdateImagePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateImagePersonParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId } = updateImagePersonParamsSchema.parse(req.params)
    const { file } = req

    const imageUpdateUseCase = container.resolve(UpdateImagePersonUseCase)
    const response = await imageUpdateUseCase.execute({
      userId: id,
      personId,
      file,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
