import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { parserUserResponse } from '@modules/accounts/responses/parsers/parseUserResponse'
import { CreateUserOAuthUseCase } from '@modules/accounts/useCases/CreateUserOAuthUseCase'

export class CreateUserOAuthController {
  async handle(req: Request, res: Response): Promise<Response> {
    console.log(req.body)
    const reqBodyParser = z.object({
      email: z.string().email(),
      imageUrl: z.string().optional().nullable(),
      name: z.string().optional().nullable(),
    })

    const { email, name, imageUrl } = reqBodyParser.parse(req.body)

    const createUserOAuthUseCase = container.resolve(CreateUserOAuthUseCase)
    const response = await createUserOAuthUseCase.execute({
      email,
      imageUrl,
      name,
    })

    const responsePartied = parserUserResponse(response)
    const responseStatusCode = response.error ? response.error.statusCode : 201

    return res.status(responseStatusCode).json(responsePartied)
  }
}
