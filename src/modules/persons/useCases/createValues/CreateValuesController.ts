import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IValue } from '@modules/persons/infra/mongoose/entities/Value'

import { CreateValueUseCase } from './CreateValuesUseCase'

export class CreateValuesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { projectId, personId } = req.body
    const values = req.body.values as IValue[]

    const createValuesUseCase = container.resolve(CreateValueUseCase)

    const updatedPerson = await createValuesUseCase.execute(
      id,
      projectId,
      personId,
      values,
    )

    return res.status(201).json(updatedPerson)
  }
}
