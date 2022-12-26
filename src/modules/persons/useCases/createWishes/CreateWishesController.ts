import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IWishe } from '@modules/persons/infra/mongoose/entities/Wishe'

import { CreateWisheUseCase } from './CreateWishesUseCase'

export class CreateWishesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId } = req.body
    const wishes = req.body.wishes as IWishe[]

    const createWishesUseCase = container.resolve(CreateWisheUseCase)

    const updatedPerson = await createWishesUseCase.execute(
      id,
      projectId,
      personId,
      wishes,
    )

    return res.status(201).json(updatedPerson)
  }
}
