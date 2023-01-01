import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ImageUpdateUseCase } from './ImageUpdateUseCase'

export class ImageUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId } = req.params
    const { file } = req

    const imageUpdateUseCase = container.resolve(ImageUpdateUseCase)

    const url = await imageUpdateUseCase.execute(id, projectId, file)

    return res.status(200).json({ url })
  }
}
