import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { MigrateOldProjectsTagsToBoxesUseCase } from './MigrateOldProjectsTagsToBoxesUseCase'

export class MigrateOldProjectsTagsToBoxesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const migrateOldProjectsTagsToBoxesUseCase = container.resolve(
      MigrateOldProjectsTagsToBoxesUseCase,
    )
    await migrateOldProjectsTagsToBoxesUseCase.execute()

    return res.status(200).end()
  }
}
