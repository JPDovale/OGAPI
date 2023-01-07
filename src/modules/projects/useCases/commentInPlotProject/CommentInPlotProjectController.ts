import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ICommentPlotProjectDTO } from '@modules/projects/dtos/ICommentPlotProjectDTO'
import { AppError } from '@shared/errors/AppError'

import { CommentInPlotProjectUseCase } from './CommentInPlotProjectUseCase'

export class CommentInPlotProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { content, to } = req.body.comment as ICommentPlotProjectDTO
    const projectId = req.body.projectId

    if (!content || !to || !projectId)
      throw new AppError({
        title: 'Ausência de informações',
        message:
          'Algumas informações necessárias para a alteração do usuário estão faltando. Verifique as informações enviadas e tente novamente.',
        statusCode: 409,
      })

    const commentInPlotProjectUseCase = container.resolve(
      CommentInPlotProjectUseCase,
    )
    const updatedProject = await commentInPlotProjectUseCase.execute(
      id,
      projectId,
      { content, to },
    )

    return res.status(200).json(updatedProject)
  }
}
