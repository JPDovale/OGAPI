import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { ListProjectsPerUserUseCase } from '@modules/projects/useCases/ListProjectsPerUserUseCase/ListProjectsPerUserUseCase'

export class ListProjectsPerUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user

    const listProjectsPerUserUseCase = container.resolve(
      ListProjectsPerUserUseCase,
    )
    const { projects } = await listProjectsPerUserUseCase.execute({
      userId: id,
    })

    return res.status(200).json({ projects })
  }
}
