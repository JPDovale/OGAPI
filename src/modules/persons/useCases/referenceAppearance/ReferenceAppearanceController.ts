import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ReferenceAppearanceUseCase } from './ReferenceAppearanceUseCase'

export class ReferenceAppearanceController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId, refId } = req.body
    const referenceAppearanceUseCase = container.resolve(
      ReferenceAppearanceUseCase,
    )

    const personUpdated = await referenceAppearanceUseCase.execute(
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
