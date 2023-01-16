import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'

import { CreatePersonUseCase } from './CreatePersonUseCase'

export class CreatePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId } = req.body

    const createPersonUseCase = container.resolve(CreatePersonUseCase)
    const person = await createPersonUseCase.execute(
      id,
      projectId,
      req.body as ICreatePersonDTO,
    )

    return res.status(201).json(person)
  }
}
