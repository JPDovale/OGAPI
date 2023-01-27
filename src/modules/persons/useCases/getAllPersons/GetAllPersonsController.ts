import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { GetAllPersonsUseCase } from './GetAllPersonsUseCase'

export class GetAllPersonsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const getAllPersonsBodySchema = z.object({
      projectId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { projectId } = getAllPersonsBodySchema.parse(req.params)

    const getAllPersonsUseCase = container.resolve(GetAllPersonsUseCase)
    const allPersonsThisUser = await getAllPersonsUseCase.execute(id, projectId)

    return res.status(200).json(allPersonsThisUser)
  }
}
