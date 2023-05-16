import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateInitialDateUseCase } from '@modules/projects/useCases/UpdateInitialDateUseCase'

export class UpdateInitialDateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateInitialDateParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const updateInitialDateBodySchema = z.object({
      initialDate: z.number(),
      timeChrist: z.enum(['A.C.', 'D.C.']),
    })

    console.log(req.body)

    const { id } = req.user
    const { projectId } = updateInitialDateParamsSchema.parse(req.params)
    const { initialDate, timeChrist } = updateInitialDateBodySchema.parse(
      req.body,
    )

    const updateInitialDateUseCase = container.resolve(UpdateInitialDateUseCase)
    await updateInitialDateUseCase.execute({
      userId: id,
      projectId,
      initialDate,
      timeChrist,
    })

    return res.status(204).end()
  }
}
