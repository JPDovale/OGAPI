import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteProjectUseCase } from '@modules/projects/useCases/DeleteProjectUseCase'

export class DeleteProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteProjectParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = deleteProjectParamsSchema.parse(req.params)

    const deleteProjectUseCase = container.resolve(DeleteProjectUseCase)
    const response = await deleteProjectUseCase.execute({
      projectId,
      userId: id,
    })

    if (response.error) {
      return res.status(response.error.statusCode).json(response)
    }

    return res.status(200).json(response)
  }
}
