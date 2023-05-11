import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { MigrateUseCase } from './MigrateUseCase'

export class MigrateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const migrateUseCase = container.resolve(MigrateUseCase)
    await migrateUseCase.execute(req.body.time)

    return res.status(200).json({ Ok: true })
  }
}
