import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { DeleteProjectUseCase } from './DeleteProjectUseCase'

export class DeleteProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId } = req.body

    const deleteProjectUseCase = container.resolve(DeleteProjectUseCase)

    await deleteProjectUseCase.execute(projectId, id)

    return res.status(200).json()
  }
}
