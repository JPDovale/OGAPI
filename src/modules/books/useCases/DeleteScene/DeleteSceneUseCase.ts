import { inject, injectable } from 'tsyringe'

import { IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { ICapitule } from '@modules/books/infra/mongoose/entities/types/ICapitule'
import { IScene } from '@modules/books/infra/mongoose/entities/types/IScene'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

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
  ) { }

  async execute({
    userId,
    bookId,
    capituleId,
    sceneId,
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

    const sceneToDelete = capituleToUpdate.scenes.find(
      (scene) => scene.id === sceneId,
    )
    const filteredScenes = capituleToUpdate.scenes.filter(
      (scene) => scene.id !== sceneId,
    )

    if (!sceneToDelete) {
      throw new AppError({
        title: 'A cena não existe',
        message: 'Parece que essa cena não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    const sceneToDeleteSequence = Number(sceneToDelete.sequence)
    const wordsToDeleteInCapitule = Number(sceneToDelete.writtenWords || '0')
    const wordsInCapitule = Number(capituleToUpdate.words || '0')
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

    return updatedBook
  }
}
