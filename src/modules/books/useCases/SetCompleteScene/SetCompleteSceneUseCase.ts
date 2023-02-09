import { inject, injectable } from 'tsyringe'

import { IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { ICapitule } from '@modules/books/infra/mongoose/entities/types/ICapitule'
import { IScene } from '@modules/books/infra/mongoose/entities/types/IScene'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

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

    const sceneToUpdate = capituleToUpdate.scenes.find(
      (scene) => scene.id === sceneId,
    )
    const indexOfSceneToUpdate = capituleToUpdate.scenes.findIndex(
      (scene) => scene.id === sceneId,
    )

    if (!sceneToUpdate || indexOfSceneToUpdate < 0) {
      throw new AppError({
        title: 'A cena não existe',
        message: 'Parece que essa cena não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    const scene: IScene = {
      ...sceneToUpdate,
      complete: true,
      writtenWords,
    }

    const scenes = capituleToUpdate.scenes
    scenes[indexOfSceneToUpdate] = scene

    const numberWrittenWordsToAdd = Number(writtenWords)
    const numberOfWordsInCapitule = Number(capituleToUpdate.words || '0')

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

    return updatedBook
  }
}
