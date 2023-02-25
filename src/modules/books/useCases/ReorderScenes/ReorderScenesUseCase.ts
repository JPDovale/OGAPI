import { inject, injectable } from 'tsyringe'

import { IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { ICapitule } from '@modules/books/infra/mongoose/entities/types/ICapitule'
import { IScene } from '@modules/books/infra/mongoose/entities/types/IScene'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  userId: string
  bookId: string
  capituleId: string
  sequenceFrom: string
  sequenceTo: string
}

@injectable()
export class ReorderScenesUseCase {
  constructor(
    @inject('BooksRepository')
    private readonly booksRepository: IBooksRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) { }

  async execute({
    bookId,
    capituleId,
    userId,
    sequenceFrom,
    sequenceTo,
  }: IRequest): Promise<IBook> {
    const book = await this.booksRepository.findById(bookId)

    if (!book) {
      throw new AppError({
        title: 'O livro não existe',
        message: 'Parece que esse livro não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    await this.verifyPermissions.verify({
      projectId: book.defaultProject,
      userId,
      verifyPermissionTo: 'edit',
    })

    const capituleToUpdate = book.capitules.find(
      (capitule) => capitule.id === capituleId,
    )
    const indexOfCapituleToUpdate = book.capitules.findIndex(
      (capitule) => capitule.id === capituleId,
    )

    if (!capituleToUpdate || indexOfCapituleToUpdate < 0) {
      throw new AppError({
        title: 'O capítulo não existe',
        message: 'Parece que esse capítulo não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    const sequenceFromInNumber = Number(sequenceFrom)
    const indexOfSceneFrom = capituleToUpdate.scenes.findIndex(
      (scene) => scene.sequence === sequenceFrom,
    )
    const sequenceToInNumber = Number(sequenceTo)
    const indexOfSceneTo = capituleToUpdate.scenes.findIndex(
      (scene) => scene.sequence === sequenceTo,
    )
    const scenesSequenceLength = capituleToUpdate.scenes.length

    if (
      sequenceToInNumber > scenesSequenceLength ||
      sequenceFromInNumber > scenesSequenceLength ||
      sequenceFromInNumber <= 0 ||
      sequenceToInNumber <= 0
    ) {
      throw new AppError({
        title: 'Valor recebido não equivalente',
        message:
          'Você passou um número maior que o número de cenas... Siga as instruções e forneça um valor até o máximo permitido',
        statusCode: 404,
      })
    }

    let scenesReordered: IScene[] = []

    if (sequenceFromInNumber < sequenceToInNumber) {
      const preScenesOfSequenceFrom = capituleToUpdate.scenes.slice(
        0,
        indexOfSceneFrom,
      )
      const middleScenes = capituleToUpdate.scenes.slice(
        indexOfSceneFrom + 1,
        indexOfSceneTo + 1,
      )
      const posScenesOfSequenceTo = capituleToUpdate.scenes.slice(
        indexOfSceneTo + 1,
        scenesSequenceLength,
      )

      scenesReordered = [
        ...preScenesOfSequenceFrom,
        ...middleScenes,
        capituleToUpdate.scenes[indexOfSceneFrom],
        ...posScenesOfSequenceTo,
      ]
    } else {
      const preScenesOfSequenceFrom = capituleToUpdate.scenes.slice(
        0,
        indexOfSceneTo,
      )
      const middleScenes = capituleToUpdate.scenes.slice(
        indexOfSceneTo,
        indexOfSceneFrom,
      )
      const posScenesOfSequenceTo = capituleToUpdate.scenes.slice(
        indexOfSceneFrom + 1,
        scenesSequenceLength,
      )

      scenesReordered = [
        ...preScenesOfSequenceFrom,
        capituleToUpdate.scenes[indexOfSceneFrom],
        ...middleScenes,
        ...posScenesOfSequenceTo,
      ]
    }

    scenesReordered = scenesReordered.map((scene, i) => {
      const sceneFinal: IScene = {
        ...scene,
        sequence: `${i + 1}`,
      }

      return sceneFinal
    })

    const updatedCapitule: ICapitule = {
      ...capituleToUpdate,
      scenes: scenesReordered,
      updatedAt: this.dateProvider.getDate(new Date()),
    }

    const capitules = book.capitules
    capitules[indexOfCapituleToUpdate] = updatedCapitule

    const updatedBook = await this.booksRepository.updateCapitules({
      id: book.id,
      capitules,
    })

    return updatedBook
  }
}
