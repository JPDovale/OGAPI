import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { DeleteImagePersonUseCase } from './DeleteImagePersonUseCase'

export class DeleteImagePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const personId = req.params.personId

    if (!personId) {
      throw new AppError({
        title: 'Ausência de informações',
        message:
          'Algumas informações necessárias para a alteração do usuário estão faltando. Verifique as informações enviadas e tente novamente.',
        statusCode: 409,
      })
    }

    const deleteImagePersonUseCase = container.resolve(DeleteImagePersonUseCase)
    const updatedPerson = await deleteImagePersonUseCase.execute(id, personId)

    return res.status(200).json(updatedPerson)
  }
}
