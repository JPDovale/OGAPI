import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { GetBookUseCase } from '@modules/books/useCases/GetBookUseCase'

export class GetBookController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetBookControllerParamsSchema = z.object({
      bookId: z.string().uuid(),
    })

    const { id } = req.user
    const { bookId } = GetBookControllerParamsSchema.parse(req.params)

    const getBookUseCase = container.resolve(GetBookUseCase)
    const { book } = await getBookUseCase.execute({
      bookId,
      userId: id,
    })

    return res.status(200).json({ book })
  }
}
