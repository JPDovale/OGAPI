import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { parserUserResponse } from '@modules/accounts/responses/parsers/parseUserResponse'
import { UserUpdateUseCase } from '@modules/accounts/useCases/UserUpdateUseCase'

export class UserUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const userUpdateBodySchema = z.object({
      name: z.string().max(200).optional(),
      email: z.string().max(100).optional(),
      age: z.string().max(4).optional(),
      sex: z.string().max(30).optional(),
      username: z.string().max(200).optional(),
    })

    const { id } = req.user
    const { username, name, email, age, sex } = userUpdateBodySchema.parse(
      req.body,
    )

    const userUpdateUseCase = container.resolve(UserUpdateUseCase)
    const response = await userUpdateUseCase.execute({
      username,
      name,
      email,
      age,
      sex,
      userId: id,
    })
    const responsePartied = parserUserResponse(response)
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(responsePartied)
  }
}
