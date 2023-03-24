import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateProjectUseCase } from '@modules/projects/useCases/createProject/createProjectUseCase'
import { AppError } from '@shared/errors/AppError'

export class CreateProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createProjectBodySchema = z.object({
      name: z.string().min(1).max(200),
      private: z.boolean().optional(),
      type: z.string().min(1).max(30),
      password: z.string().max(100).optional(),
    })

    const {
      name,
      private: priv,
      type,
      password,
    } = createProjectBodySchema.parse(req.body)
    const { id } = req.user

    if (
      type !== 'rpg' &&
      type !== 'book' &&
      type !== 'gameplay' &&
      type !== 'roadMap'
    ) {
      throw new AppError({
        title: 'Informações invalida',
        message:
          'Algumas informações estão fora do padrão esperado para a criação do projeto.',
        statusCode: 401,
      })
    }

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
