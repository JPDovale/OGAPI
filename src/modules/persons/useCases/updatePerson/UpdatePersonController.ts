import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdatePersonUseCase } from './UpdatePersonUseCase'

export class UpdatePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updatePersonBodySchema = z.object({
      personId: z.string().min(6).max(100),
      person: z.object({
        name: z.string().min(1).max(60).optional(),
        lastName: z.string().min(1).max(60).optional(),
        history: z.string().min(1).max(10000).optional(),
        age: z.string().min(1).max(10).regex(/^\d+$/).optional(),
      }),
    })

    const { id } = req.user
    const {
      personId,
      person: { age, history, lastName, name },
    } = updatePersonBodySchema.parse(req.body)

    const updatePersonUseCase = container.resolve(UpdatePersonUseCase)
    const personUpdated = await updatePersonUseCase.execute(id, personId, {
      age,
      history,
      lastName,
      name,
    })

    return res.status(200).json(personUpdated)
  }
}
