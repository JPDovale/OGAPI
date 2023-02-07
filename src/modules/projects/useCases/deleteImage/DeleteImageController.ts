import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteImageUseCase } from './DeleteImageUseCase'

export class DeleteImageController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteImageParamsSchema = z.object({
      projectId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { projectId } = deleteImageParamsSchema.parse(req.params)

    const deleteImageUseCase = container.resolve(DeleteImageUseCase)
    const updatedProject = await deleteImageUseCase.execute(id, projectId)

    return res.status(200).json(updatedProject)
  }
}
