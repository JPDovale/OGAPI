import { inject, injectable } from 'tsyringe'

import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { ICapitulesRepository } from '@modules/books/infra/repositories/contracts/ICapitulesRepository'
import { IScenesRepository } from '@modules/books/infra/repositories/contracts/IScenesRepository'
import { type IScene } from '@modules/books/infra/repositories/entities/IScene'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorBookNotUpdate } from '@shared/errors/books/makeErrorBookNotUpdate'
import { makeErrorCapituleNotFound } from '@shared/errors/books/makeErrorCapituleNotFound'
import { makeErrorSceneNotFound } from '@shared/errors/books/makeErrorSceneNotFound'
import { makeInternalError } from '@shared/errors/useFull/makeInternalError'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  bookId: string
  capituleId: string
  sceneId: string
  writtenWords: number
}

interface IResponse {
  scene: IScene
  bookWrittenWords: number
}

@injectable()
export class SetCompleteSceneUseCase {
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
    writtenWords,
  }: IRequest): Promise<IResolve<IResponse>> {
    const book = await this.booksRepository.findById(bookId)
    if (!book) {
      return {
        ok: false,
        error: makeErrorBookNotFound(),
      }
    }
    if (!book.capitules) {
      return {
        ok: false,
        error: makeInternalError(),
      }
    }

    await this.verifyPermissions.verify({
      projectId: book.project_id,
      userId,
      verifyPermissionTo: 'edit',
    })

    const capituleToUpdate = await this.capitulesRepository.findById(capituleId)
    if (!capituleToUpdate) {
      return {
        ok: false,
        error: makeErrorCapituleNotFound(),
      }
    }

    const sceneToUpdate = await this.scenesRepository.findById(sceneId)
    if (!sceneToUpdate) {
      return {
        ok: false,
        error: makeErrorSceneNotFound(),
      }
    }

    const scene = await this.scenesRepository.update({
      sceneId,
      data: {
        complete: true,
        written_words: writtenWords,
      },
    })
    if (!scene) {
      return {
        ok: false,
        error: makeErrorBookNotUpdate(),
      }
    }

    const filteredScenes = capituleToUpdate.scenes?.filter(
      (scene) => scene.id !== sceneId,
    )
    const capituleIsIncomplete = !!filteredScenes?.find(
      (scene) => !scene.complete,
    )

    const capitule = await this.capitulesRepository.update({
      capituleId,
      data: {
        complete: !capituleIsIncomplete,
        words: capituleToUpdate.words + scene.written_words,
      },
    })

    if (!capitule) {
      return {
        ok: false,
        error: makeErrorBookNotUpdate(),
      }
    }

    const indexOfCapituleToUpdate = book.capitules?.findIndex(
      (capitule) => capitule.id === capituleId,
    )

    const capitules = book.capitules
    capitules[indexOfCapituleToUpdate] = capitule

    let wordsInBook = 0
    capitules.map((capitule) => (wordsInBook = wordsInBook + capitule.words))

    if (wordsInBook !== book.written_words) {
      await this.booksRepository.update({
        bookId,
        data: {
          written_words: wordsInBook,
        },
      })
    }

    return {
      ok: true,
      data: {
        scene,
        bookWrittenWords: wordsInBook,
      },
    }
  }
}
