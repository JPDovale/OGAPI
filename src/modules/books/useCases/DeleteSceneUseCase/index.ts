import { inject, injectable } from 'tsyringe'

import { type IUpdateManyScenesDTO } from '@modules/books/dtos/IUpdateManyScenesDTO'
import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { ICapitulesRepository } from '@modules/books/infra/repositories/contracts/ICapitulesRepository'
import { IScenesRepository } from '@modules/books/infra/repositories/contracts/IScenesRepository'
import { type ICapitule } from '@modules/books/infra/repositories/entities/ICapitule'
import { type IScene } from '@modules/books/infra/repositories/entities/IScene'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorBookNotUpdate } from '@shared/errors/books/makeErrorBookNotUpdate'
import { makeErrorCapituleNotFound } from '@shared/errors/books/makeErrorCapituleNotFound'
import { makeErrorSceneNotFound } from '@shared/errors/books/makeErrorSceneNotFound'
import { makeInternalError } from '@shared/errors/useFull/makeInternalError'

interface IRequest {
  bookId: string
  capituleId: string
  sceneId: string
  userId: string
}

interface IResponse {
  scenes: IScene[]
  capituleComplete: boolean
  bookWrittenWords: number
}

@injectable()
export class DeleteSceneUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BooksRepository)
    private readonly booksRepository: IBooksRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.CapitulesRepository)
    private readonly capitulesRepository: ICapitulesRepository,

    @inject(InjectableDependencies.Repositories.ScenesRepository)
    private readonly scenesRepository: IScenesRepository,
  ) {}

  async execute({
    userId,
    bookId,
    capituleId,
    sceneId,
  }: IRequest): Promise<IResponse> {
    const book = await this.booksRepository.findById(bookId)
    if (!book) throw makeErrorBookNotFound()
    if (!book.capitules) throw makeInternalError()

    await this.verifyPermissions.verify({
      projectId: book.project_id,
      userId,
      verifyPermissionTo: 'edit',
    })

    const capituleToUpdate = await this.capitulesRepository.findById(capituleId)
    if (!capituleToUpdate) throw makeErrorCapituleNotFound()

    const sceneToDelete = await this.scenesRepository.findById(sceneId)
    const filteredScenes =
      capituleToUpdate.scenes?.filter((scene) => scene.id !== sceneId) ?? []

    if (!sceneToDelete) throw makeErrorSceneNotFound()

    const updatedScenes: IUpdateManyScenesDTO = filteredScenes.map((scene) => {
      if (scene.sequence < sceneToDelete.sequence) return null

      return {
        sceneId: scene.id,
        data: {
          sequence: scene.sequence - 1,
        },
      }
    })

    await this.scenesRepository.updateMany(updatedScenes)

    let capitule: ICapitule
    const capituleIsIncomplete = !!filteredScenes.find(
      (scene) => !scene.complete,
    )
    const newNumberWordsInCapitule =
      capituleToUpdate.words - sceneToDelete.written_words

    const sameChangeInCapitule =
      capituleIsIncomplete !== capituleToUpdate.complete ||
      newNumberWordsInCapitule !== capituleToUpdate.words

    if (!sameChangeInCapitule) {
      capitule = capituleToUpdate
    } else {
      const updatedCapitule = await this.capitulesRepository.update({
        capituleId,
        data: {
          words: newNumberWordsInCapitule,
          complete: capituleIsIncomplete,
        },
      })

      if (!updatedCapitule) throw makeErrorBookNotUpdate()

      capitule = updatedCapitule
    }

    const indexOfCapituleToUpdate = book.capitules?.findIndex(
      (capitule) => capitule.id === capituleId,
    )

    const capitules = book.capitules
    capitules[indexOfCapituleToUpdate] = capitule

    let wordsInBook = 0

    capitules.map((capitule) => {
      const wordsInNumber = capitule.words

      wordsInBook = wordsInBook + wordsInNumber
      return ''
    })

    if (wordsInBook !== book.written_words) {
      await this.booksRepository.update({
        bookId,
        data: {
          written_words: wordsInBook,
        },
      })
    }

    return {
      scenes: filteredScenes,
      bookWrittenWords: wordsInBook,
      capituleComplete: capitule.complete,
    }
  }
}
