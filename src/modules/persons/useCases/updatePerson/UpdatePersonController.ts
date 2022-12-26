import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'

import { UpdatePersonUseCase } from './UpdatePersonUseCase'

export class UpdatePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const personId = req.body.personId
    const person = req.body.person as ICreatePersonDTO

    const updatePersonUseCase = container.resolve(UpdatePersonUseCase)
    const personUpdated = await updatePersonUseCase.execute(id, personId, {
      age: person.age,
      history: person.history,
      lastName: person.lastName,
      name: person.lastName,
    })

    return res.status(200).json(personUpdated)
  }
}
