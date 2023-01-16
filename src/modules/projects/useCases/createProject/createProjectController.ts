import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { CreateProjectUseCase } from './CreateProjectUseCase'

export class CreateProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, private: priv, type, password } = req.body
    const { id } = req.user

    if (!name || !type)
      throw new AppError({
        title: 'Ausência de informações',
        message:
          'Algumas informações necessárias para a alteração do usuário estão faltando. Verifique as informações enviadas e tente novamente.',
        statusCode: 409,
      })

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
        statusCode: 409,
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
