import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { ShareProjectUseCase } from './ShareProjectUseCase'

export class ShareProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { user, projectId } = req.body

    if (!user || !projectId)
      throw new AppError({
        title: 'Ausência de informações',
        message:
          'Algumas informações necessárias para a alteração do usuário estão faltando. Verifique as informações enviadas e tente novamente.',
        statusCode: 409,
      })

    const shareProjectUseCase = container.resolve(ShareProjectUseCase)

    const updatedProject = await shareProjectUseCase.execute(
      user,
      projectId,
      req.user.id,
    )

    return res.status(200).json(updatedProject)
  }
}
