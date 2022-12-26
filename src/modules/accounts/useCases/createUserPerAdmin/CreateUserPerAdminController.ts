import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { CreateUserPerAdminUseCase } from './CreateUserPerAdminUseCase'

export class CreateUserPerAdminController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, username } = req.body

    const createUserPerAdminUseCase = container.resolve(
      CreateUserPerAdminUseCase,
    )
    await createUserPerAdminUseCase.execute({ name, username })

    return res.status(201).json({ message: 'Usuário criado' })
  }
}
