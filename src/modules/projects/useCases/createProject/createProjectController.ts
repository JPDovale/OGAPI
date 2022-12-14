import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { CreateProjectUseCase } from './createProjectUseCase'

export class CreateProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, private: priv, type, password } = req.body
    const { id } = req.user

    const createProjectUseCase = container.resolve(CreateProjectUseCase)

    const newProject = await createProjectUseCase.execute({
      user: { id },
      project: {
        name,
        private: priv,
        type,
        password,
      },
    })

    return res.status(201).json(newProject)
  }
}
