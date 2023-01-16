import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ReferenceFearUseCase } from './ReferenceFearUseCase'

export class ReferenceFearController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId, refId } = req.body
    const referenceFeraUseCase = container.resolve(ReferenceFearUseCase)

    const personUpdated = await referenceFeraUseCase.execute(
      id,
      projectId,
      personId,
      refId,
    )

    return res.status(200).json(personUpdated)
  }
}
