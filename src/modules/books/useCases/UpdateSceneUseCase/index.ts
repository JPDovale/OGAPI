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
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  bookId: string
  userId: string
  capituleId: string
  sceneId: string
  objective?: string
  writtenWords?: number
  structure?: {
    act1?: string
    act2?: string
    act3?: string
  }
  complete: boolean
  persons: string[]
}

interface IResponse {
  scene: IScene
  bookWrittenWords: number
}

@injectable()
export class UpdateSceneUseCase {
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
    bookId,
    capituleId,
    complete,
    persons,
    sceneId,
    userId,
    objective,
    structure,
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
        error: makeErrorCapituleNotFound(),
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
        complete: writtenWords !== 0,
        written_words: complete ? writtenWords : 0,
        objective,
        structure_act_1: structure?.act1,
        structure_act_2: structure?.act2,
        structure_act_3: structure?.act3,
        persons: {
          disconnect: sceneToUpdate.persons?.map((person) => ({
            id: person.id,
          })),
          connect: persons.map((id) => ({ id })),
        },
      },
    })
    if (!scene) {
      return {
        ok: false,
        error: makeErrorBookNotUpdate(),
      }
    }

    const filteredScenes =
      capituleToUpdate.scenes?.filter((scene) => scene.id !== sceneId) ?? []
    const capituleIsIncomplete = !filteredScenes?.find(
      (scene) => !scene.complete,
    )

    const scenesInCapitule = [...filteredScenes, scene]
    let wordsInCapitule = 0

    scenesInCapitule.map(
      (scene) => (wordsInCapitule = wordsInCapitule + scene.written_words),
    )

    const capitule = await this.capitulesRepository.update({
      capituleId,
      data: {
        complete: !capituleIsIncomplete,
        words: wordsInCapitule,
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
