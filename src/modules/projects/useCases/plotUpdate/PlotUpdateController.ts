import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { PlotUpdateUseCase } from './PlotUpdateUseCase'

export class PlotUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const plot = req.body
    const { projectId } = req.params

    const plotUpdateUseCase = container.resolve(PlotUpdateUseCase)

    const project = await plotUpdateUseCase.execute(plot, id, projectId)
    return res.status(200).json(project)
  }
}
