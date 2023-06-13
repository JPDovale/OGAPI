import { inject, injectable } from 'tsyringe'

import { type IUpdateManyScenesDTO } from '@modules/books/dtos/IUpdateManyScenesDTO'
import { type IUpdateSceneDTO } from '@modules/books/dtos/IUpdateSceneDTO'
import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { ICapitulesRepository } from '@modules/books/infra/repositories/contracts/ICapitulesRepository'
import { IScenesRepository } from '@modules/books/infra/repositories/contracts/IScenesRepository'
import { type IScene } from '@modules/books/infra/repositories/entities/IScene'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorCapituleNotFound } from '@shared/errors/books/makeErrorCapituleNotFound'
import { makeErrorReorderValues } from '@shared/errors/books/makeErrorReorderValues'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  bookId: string
  capituleId: string
  sequenceFrom: number
  sequenceTo: number
}

interface IResponse {
  scenes: IScene[]
}

@injectable()
export class ReorderScenesUseCase {
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
    userId,
    sequenceFrom,
    sequenceTo,
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
        error: makeErrorReorderValues(),
      }
    }

    const verification = await this.verifyPermissions.verify({
      projectId: book.project_id,
      userId,
      verifyPermissionTo: 'edit',
      verifyFeatureInProject: ['books'],
    })

    if (verification.error) {
      return {
        ok: false,
        error: verification.error,
      }
    }

    const capituleToUpdate = await this.capitulesRepository.findById(capituleId)
    if (!capituleToUpdate) {
      return {
        ok: false,
        error: makeErrorCapituleNotFound(),
      }
    }
    if (!capituleToUpdate.scenes) {
      return {
        ok: false,
        error: makeErrorReorderValues(),
      }
    }

    const indexOfSceneFrom = capituleToUpdate.scenes.findIndex(
      (scene) => scene.sequence === sequenceFrom,
    )
    const indexOfSceneTo = capituleToUpdate.scenes.findIndex(
      (scene) => scene.sequence === sequenceTo,
    )
    const scenesSequenceLength = capituleToUpdate.scenes.length

    const isInvalidSequenceTo =
      sequenceTo > scenesSequenceLength ||
      sequenceFrom > scenesSequenceLength ||
      sequenceFrom <= 0 ||
      sequenceTo <= 0

    if (isInvalidSequenceTo) {
      return {
        ok: false,
        error: makeErrorReorderValues(),
      }
    }

    let scenesReordered: IScene[] = []

    if (sequenceFrom < sequenceTo) {
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

    const updatedScenes: IUpdateManyScenesDTO = scenesReordered.map(
      (scene, i) => {
        const updatedScene: IUpdateSceneDTO = {
          sceneId: scene.id,
          data: {
            sequence: i + 1,
          },
        }

        return updatedScene
      },
    )

    await this.scenesRepository.updateMany(updatedScenes)

    const scenes = await this.capitulesRepository.listScenes(capituleId)

    return {
      ok: true,
      data: {
        scenes,
      },
    }
  }
}
