import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteProjectUseCase } from './DeleteProjectUseCase'

export class DeleteProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteProjectBodySchema = z.object({
      projectId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { projectId } = deleteProjectBodySchema.parse(req.body)

    const deleteProjectUseCase = container.resolve(DeleteProjectUseCase)
    await deleteProjectUseCase.execute(projectId, id)

    return res.status(200).json()
  }
}
