import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdatePersonUseCase } from '@modules/persons/useCases/UpdatePersonUseCase'

export class UpdatePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updatePersonParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const updatePersonBodySchema = z.object({
      name: z.string().min(1).max(60).optional(),
      lastName: z.string().min(1).max(60).optional(),
      history: z.string().min(1).max(10000).optional(),
      age: z.number().max(1000000).optional(),
    })

    const { id } = req.user
    const { personId } = updatePersonParamsSchema.parse(req.params)
    const { age, history, lastName, name } = updatePersonBodySchema.parse(
      req.body,
    )

    const updatePersonUseCase = container.resolve(UpdatePersonUseCase)
    const { person } = await updatePersonUseCase.execute({
      userId: id,
      personId,
      age,
      history,
      lastName,
      name,
    })

    return res.status(200).json({ person })
  }
}
