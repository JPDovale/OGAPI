import { inject, injectable } from 'tsyringe'

import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { makeErrorBoxNotFound } from '@shared/errors/boxes/makeErrorBoxNotFound'
import { makeErrorBoxNotUpdate } from '@shared/errors/boxes/makeErrorBoxNotUpdate'

interface IRequest {
  boxId: string
  name?: string
  description?: string
  tags?: Array<{
    name: string
  }>
}

interface IResponse {
  box: IBox
}

@injectable()
export class UpdateBoxUseCase {
  constructor(
    @inject('BoxesRepository')
    private readonly boxesRepository: IBoxesRepository,
  ) {}

  async execute({
    boxId,
    name,
    description,
    tags,
  }: IRequest): Promise<IResponse> {
    const box = await this.boxesRepository.findById(boxId)
    if (!box) throw makeErrorBoxNotFound()

    if (!name && !description && !tags) return { box }
    const updatedBox = await this.boxesRepository.update({
      id: box.id,
      name: name ?? box.name,
      description: description ?? box.description,
      tags: tags ?? box.tags,
    })

    if (!updatedBox) throw makeErrorBoxNotUpdate()

    return { box: updatedBox }
  }
}
