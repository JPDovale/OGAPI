import { inject, injectable } from 'tsyringe'

import { type IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { type ICapitule } from '@modules/books/infra/mongoose/entities/types/ICapitule'
import { type IScene } from '@modules/books/infra/mongoose/entities/types/IScene'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorBookNotUpdate } from '@shared/errors/books/makeErrorBookNotUpdate'
import { makeErrorCapituleNotFound } from '@shared/errors/books/makeErrorCapituleNotFound'
import { makeErrorReorderValues } from '@shared/errors/books/makeErrorReorderValues'

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
  ) {}

  async execute({
    bookId,
    capituleId,
    userId,
    sequenceFrom,
    sequenceTo,
  }: IRequest): Promise<IBook> {
    const book = await this.booksRepository.findById(bookId)

    if (!book) throw makeErrorBookNotFound()

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

    if (!capituleToUpdate || indexOfCapituleToUpdate < 0)
      throw makeErrorCapituleNotFound()

    const sequenceFromInNumber = Number(sequenceFrom)
    const indexOfSceneFrom = capituleToUpdate.scenes.findIndex(
      (scene) => scene.sequence === sequenceFrom,
    )
    const sequenceToInNumber = Number(sequenceTo)
    const indexOfSceneTo = capituleToUpdate.scenes.findIndex(
      (scene) => scene.sequence === sequenceTo,
    )
    const scenesSequenceLength = capituleToUpdate.scenes.length

    const isInvalidSequenceTo =
      sequenceToInNumber > scenesSequenceLength ||
      sequenceFromInNumber > scenesSequenceLength ||
      sequenceFromInNumber <= 0 ||
      sequenceToInNumber <= 0

    if (isInvalidSequenceTo) throw makeErrorReorderValues()

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
      writtenWords: book.writtenWords,
    })

    if (!updatedBook) throw makeErrorBookNotUpdate

    return updatedBook
  }
}
