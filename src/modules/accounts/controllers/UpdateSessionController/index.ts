import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateSessionUseCase } from '@modules/accounts/useCases/UpdateSessionUseCase'

export class UpdateSessionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const reqParamsParser = z.object({
      sessionToken: z.string(),
    })

    const reqBodyParser = z.object({
      expires: z.coerce.date().optional(),
      userId: z.string().optional(),
    })

    const { sessionToken } = reqParamsParser.parse(req.params)
    const { expires, userId } = reqBodyParser.parse(req.body)

    const updateSessionUseCase = container.resolve(UpdateSessionUseCase)
    const response = await updateSessionUseCase.execute({
      userId,
      expires,
      sessionToken,
    })

    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
