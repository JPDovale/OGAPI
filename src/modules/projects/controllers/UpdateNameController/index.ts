import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateNameUseCase } from '@modules/projects/useCases/UpdateNameUseCase'

export class UpdateNameController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateNameParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const updateNameBodySchema = z.object({
      name: z.string().min(1).max(150),
    })

    const { id } = req.user
    const { projectId } = updateNameParamsSchema.parse(req.params)
    const { name } = updateNameBodySchema.parse(req.body)

    const updateNameUseCase = container.resolve(UpdateNameUseCase)
    const response = await updateNameUseCase.execute({
      userId: id,
      projectId,
      name,
    })

    if (response.error) {
      return res.status(response.error.statusCode).json(response)
    }

    return res.status(200).json(response)
  }
}
