import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateToDoTimeLineUseCase } from '@modules/timelines/useCases/CreateToDoTimeLineUseCase '

export class CreateToDoTimeLineController {
  async handle(req: Request, res: Response): Promise<Response> {
    const reqBodyParser = z.object({
      title: z.string().min(2).max(160),
      description: z.string().min(2).max(600),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    })

    const { id } = req.user
    const { description, title, endDate, startDate } = reqBodyParser.parse(
      req.body,
    )

    const createToDoTimeLineUseCase = container.resolve(
      CreateToDoTimeLineUseCase,
    )
    await createToDoTimeLineUseCase.execute({
      userId: id,
      title,
      description,
      startDate,
      endDate,
    })

    return res.status(201).end()
  }
}
