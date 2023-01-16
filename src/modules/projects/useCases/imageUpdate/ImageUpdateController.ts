import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { ImageUpdateUseCase } from './ImageUpdateUseCase'

export class ImageUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId } = req.params
    const { file } = req

    if (!file || !projectId)
      throw new AppError({
        title: 'Ausência de informações',
        message:
          'Algumas informações necessárias para a alteração do usuário estão faltando. Verifique as informações enviadas e tente novamente.',
        statusCode: 409,
      })

    const imageUpdateUseCase = container.resolve(ImageUpdateUseCase)

    const projectUpdated = await imageUpdateUseCase.execute(id, projectId, file)

    return res.status(200).json(projectUpdated)
  }
}
