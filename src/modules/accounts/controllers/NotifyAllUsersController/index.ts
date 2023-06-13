import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { NotifyAllUsersUseCase } from '@modules/accounts/useCases/NotifyAllUsersUseCase'

export class NotifyAllUsersController {
  async handle(req: Request, res: Response): Promise<Response> {
    const notifyAllUsersBodySchema = z.object({
      title: z
        .string()
        .min(1)
        .max(10000)
        .regex(/^[^<>{}\\]+$/),
      content: z
        .string()
        .min(1)
        .max(10000)
        .regex(/^[^<>{}\\]+$/),
    })

    const { content, title } = notifyAllUsersBodySchema.parse(req.body)

    const notifyAllUsersUseCase = container.resolve(NotifyAllUsersUseCase)
    const response = await notifyAllUsersUseCase.execute({ title, content })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
