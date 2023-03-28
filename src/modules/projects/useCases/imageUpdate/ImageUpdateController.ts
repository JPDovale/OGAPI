import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ImageUpdateUseCase } from './ImageUpdateUseCase'

export class ImageUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const imageUpdateParamsSchema = z.object({
      projectId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { projectId } = imageUpdateParamsSchema.parse(req.params)
    const { file } = req

    const imageUpdateUseCase = container.resolve(ImageUpdateUseCase)
    const projectUpdated = await imageUpdateUseCase.execute(id, projectId, file)

    return res.status(200).json(projectUpdated)
  }
}
