import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteImageUseCase } from '@modules/projects/useCases/DeleteImageUseCase'

export class DeleteImageController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteImageParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = deleteImageParamsSchema.parse(req.params)

    const deleteImageUseCase = container.resolve(DeleteImageUseCase)
    const updatedProject = await deleteImageUseCase.execute({
      userId: id,
      projectId,
    })

    return res.status(200).json(updatedProject)
  }
}
