import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { GetTodoTimeLinesUseCase } from '@modules/timelines/useCases/GetTodoTimeLinesUseCase'

export class GetTodoTimeLinesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user

    const getTodoTimeLinesUseCase = container.resolve(GetTodoTimeLinesUseCase)
    const { timeLines } = await getTodoTimeLinesUseCase.execute({
      userId: id,
    })

    return res.status(200).json({ timeLines })
  }
}
