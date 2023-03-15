import { inject, injectable } from 'tsyringe'

import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'

interface IRequest {
  userId: string
  boxId: string
  filesUrl?: string[]
  title: string
  description: string
}

interface IResponse {
  box: IBox
}

@injectable()
export class CreateArchiveUseCase {
  constructor(
    @inject('BoxesRepository')
    private readonly boxesRepository: IBoxesRepository,
  ) {}

  async execute({
    boxId,
    description,
    title,
    userId,
    filesUrl,
  }: IRequest): Promise<IResponse> {
    const box = await this.boxesRepository.findById(boxId)
  }
}
