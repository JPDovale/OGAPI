import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateFrontCoverBookUseCase } from '@modules/books/useCases/UpdateFrontCoverUseCase'

export class UpdateFrontCoverBookController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateFrontCoverBookParamsSchema = z.object({
      bookId: z.string().uuid(),
    })

    const { id } = req.user
    const { bookId } = updateFrontCoverBookParamsSchema.parse(req.params)
    const { file } = req

    const updateFrontCoverBookUseCase = container.resolve(
      UpdateFrontCoverBookUseCase,
    )
    const { frontCoveFilename, frontCoverUrl } =
      await updateFrontCoverBookUseCase.execute({
        userId: id,
        bookId,
        file,
      })

    return res.status(200).json({ frontCoveFilename, frontCoverUrl })
  }
}
