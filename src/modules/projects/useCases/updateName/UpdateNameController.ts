import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateNameUseCase } from './UpdateNameUseCase'

export class UpdateNameController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateTitleBodySchema = z.object({
      name: z.string().min(1).max(150),
      projectId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { projectId, name } = updateTitleBodySchema.parse(req.body)

    const updateNameUseCase = container.resolve(UpdateNameUseCase)
    const updatedProject = await updateNameUseCase.execute({
      userId: id,
      projectId,
      name,
    })

    return res.status(200).json(updatedProject)
  }
}
