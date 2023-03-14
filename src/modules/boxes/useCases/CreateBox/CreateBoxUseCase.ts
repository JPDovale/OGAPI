import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { ICreateBoxDTO } from '@modules/boxes/dtos/ICrateBoxDTO'
import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  userId: string
  name: string
  description?: string
  tags?: Array<{
    name: string
  }>
}

interface IResponse {
  box: IBox
}

@injectable()
export class CreateBoxUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('BoxesRepository')
    private readonly boxesRepository: IBoxesRepository,
  ) {}

  async execute({
    name,
    tags,
    userId,
    description,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new AppError({
        title: 'Usuário não encontrado.',
        message: 'Parece que esse usuário não existe na nossa base de dados...',
        statusCode: 404,
      })
    }

    const registersNotInternalThisUser =
      await this.boxesRepository.numberOfBoxesNotInternalByUserId(userId)

    if (registersNotInternalThisUser >= 3 && !user.payed) {
      throw new AppError({
        title: 'Limite atingido!.',
        message:
          'Parece que você atingiu o limite de criação de boxes para o plano free... Que tal tentar o nosso plano básico?',
        statusCode: 400,
      })
    }

    const newBox: ICreateBoxDTO = {
      name,
      description: description || '',
      tags: tags || [],
      userId,
      internal: false,
      type: 'default',
    }

    const box = await this.boxesRepository.create(newBox)
    return { box }
  }
}
