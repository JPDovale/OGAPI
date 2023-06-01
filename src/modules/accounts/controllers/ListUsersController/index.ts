import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ListUsersUseCase } from '@modules/accounts/useCases/ListUsersUseCase'

export class ListUsersController {
  async handle(req: Request, res: Response): Promise<Response> {
    const listUsersQuerySchema = z.object({
      page: z.coerce.number(),
    })

    const { page } = listUsersQuerySchema.parse(req.query)

    const listUsersUseCase = container.resolve(ListUsersUseCase)
    const response = await listUsersUseCase.execute({ page })

    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
