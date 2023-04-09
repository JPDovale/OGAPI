import { inject, injectable } from 'tsyringe'

import { type IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { type ICapitule } from '@modules/books/infra/mongoose/entities/types/ICapitule'
import { type IScene } from '@modules/books/infra/mongoose/entities/types/IScene'
import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorBookNotUpdate } from '@shared/errors/books/makeErrorBookNotUpdate'
import { makeErrorCapituleNotFound } from '@shared/errors/books/makeErrorCapituleNotFound'
import { makeErrorSceneNotFound } from '@shared/errors/books/makeErrorSceneNotFound'

interface IRequest {
  bookId: string
  capituleId: string
  sceneId: string
  userId: string
}

@injectable()
export class DeleteSceneUseCase {
  constructor(
    @inject('BooksRepository')
    private readonly booksRepository: IBooksRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute({
    userId,
    bookId,
    capituleId,
    sceneId,
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

    const sceneToDelete = capituleToUpdate.scenes.find(
      (scene) => scene.id === sceneId,
    )
    const filteredScenes = capituleToUpdate.scenes.filter(
      (scene) => scene.id !== sceneId,
    )

    if (!sceneToDelete) throw makeErrorSceneNotFound()

    const sceneToDeleteSequence = Number(sceneToDelete.sequence)
    const wordsToDeleteInCapitule = Number(sceneToDelete.writtenWords ?? '0')
    const wordsInCapitule = Number(capituleToUpdate.words ?? '0')
    const capituleComplete = !filteredScenes.find((scene) => !scene.complete)

    const updatedScenes = filteredScenes.map((scene) => {
      const sceneSequence = Number(scene.sequence)

      if (sceneSequence < sceneToDeleteSequence) return scene

      const updatedScene: IScene = {
        ...scene,
        sequence: `${sceneSequence - 1}`,
      }

      return updatedScene
    })

    const updatedCapitule: ICapitule = {
      ...capituleToUpdate,
      scenes: updatedScenes,
      words: `${wordsInCapitule - wordsToDeleteInCapitule}`,
      complete: capituleComplete,
      updatedAt: this.dateProvider.getDate(new Date()),
    }

    const capitules = book.capitules
    capitules[indexOfCapituleToUpdate] = updatedCapitule

    let wordsInBook = 0

    capitules.map((capitule) => {
      const wordsInNumber = Number(capitule.words)

      wordsInBook = wordsInBook + wordsInNumber
      return ''
    })

    const updatedBook = await this.booksRepository.updateCapitules({
      id: book.id,
      capitules,
      writtenWords: `${wordsInBook}`,
    })

    if (!updatedBook) throw makeErrorBookNotUpdate()

    return updatedBook
  }
}
