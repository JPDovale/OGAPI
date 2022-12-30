import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ReferenceDreamUseCase } from './ReferenceDreamUseCase'

export class ReferenceDreamController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId, refId } = req.body
    const referenceDreamUseCase = container.resolve(ReferenceDreamUseCase)

    const personUpdated = await referenceDreamUseCase.execute(
      id,
      projectId,
      personId,
      refId,
    )

    return res
      .status(200)
      .json({ success: 'Referencia criada com sucesso', person: personUpdated })
  }
}
