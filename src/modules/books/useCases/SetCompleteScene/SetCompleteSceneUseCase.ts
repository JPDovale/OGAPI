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
import { makeErrorSceneNotFound } from '@shared/errors/books/makeErrorSceneNotFound'

interface IRequest {
  userId: string
  bookId: string
  capituleId: string
  sceneId: string
  writtenWords: string
}

@injectable()
export class SetCompleteSceneUseCase {
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
    writtenWords,
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

    const sceneToUpdate = capituleToUpdate.scenes.find(
      (scene) => scene.id === sceneId,
    )
    const indexOfSceneToUpdate = capituleToUpdate.scenes.findIndex(
      (scene) => scene.id === sceneId,
    )

    if (!sceneToUpdate || indexOfSceneToUpdate < 0)
      throw makeErrorSceneNotFound()

    const scene: IScene = {
      ...sceneToUpdate,
      complete: true,
      writtenWords,
    }

    const scenes = capituleToUpdate.scenes
    scenes[indexOfSceneToUpdate] = scene

    const numberWrittenWordsToAdd = Number(writtenWords)
    const numberOfWordsInCapitule = Number(capituleToUpdate.words ?? '0')

    const newNumberOfWordsInCapitule = `${
      numberOfWordsInCapitule + numberWrittenWordsToAdd
    }`

    const sceneIncomplete = capituleToUpdate.scenes.find(
      (scene) => !scene.complete,
    )

    const capitule: ICapitule = {
      ...capituleToUpdate,
      complete: !sceneIncomplete,
      words: newNumberOfWordsInCapitule,
      updatedAt: this.dateProvider.getDate(new Date()),
    }

    const capitules = book.capitules
    capitules[indexOfCapituleToUpdate] = capitule

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
