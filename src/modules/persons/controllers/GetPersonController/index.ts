import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { GetPersonUseCase } from '@modules/persons/useCases/GetPersonUseCase'

export class GetPersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetPersonControllerParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId } = GetPersonControllerParamsSchema.parse(req.params)

    const getPersonUseCase = container.resolve(GetPersonUseCase)
    const { person } = await getPersonUseCase.execute({
      personId,
      userId: id,
    })

    return res.status(200).json({ person })
  }
}
