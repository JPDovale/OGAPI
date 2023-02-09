import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateFrontCoverBookUseCase } from './UpdateFrontCoverBookUseCase'

export class UpdateFrontCoverBookController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateFrontCoverBookParamsSchema = z.object({
      bookId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { bookId } = updateFrontCoverBookParamsSchema.parse(req.params)
    const { file } = req

    const updateFrontCoverBookUseCase = container.resolve(
      UpdateFrontCoverBookUseCase,
    )
    const updatedBook = await updateFrontCoverBookUseCase.execute({
      userId: id,
      bookId,
      file,
    })

    return res.status(200).json(updatedBook)
  }
}
