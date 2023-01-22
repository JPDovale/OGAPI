import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { DeleteImageUseCase } from './DeleteImageUseCase'

export class DeleteImageController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const projectId = req.params.projectId

    if (!projectId) {
      throw new AppError({
        title: 'Ausência de informações',
        message:
          'Algumas informações necessárias para a alteração do usuário estão faltando. Verifique as informações enviadas e tente novamente.',
        statusCode: 409,
      })
    }

    const deleteImageUseCase = container.resolve(DeleteImageUseCase)
    const updatedProject = await deleteImageUseCase.execute(id, projectId)

    return res.status(200).json(updatedProject)
  }
}
