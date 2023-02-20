import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateUserPerAdminUseCase } from './CreateUserPerAdminUseCase'

export class CreateUserPerAdminController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createUserPerAdminBodySchema = z.object({
      name: z.string().min(1).max(200),
      age: z.string().max(4).optional(),
      sex: z.string().max(30).optional(),
      username: z.string().max(200).optional(),
    })

    const { name, username, age, sex } = createUserPerAdminBodySchema.parse(
      req.body,
    )

    const createUserPerAdminUseCase = container.resolve(
      CreateUserPerAdminUseCase,
    )
    const newUser = await createUserPerAdminUseCase.execute({
      name,
      username,
      age,
      sex,
    })

    return res.status(201).json(newUser)
  }
}
