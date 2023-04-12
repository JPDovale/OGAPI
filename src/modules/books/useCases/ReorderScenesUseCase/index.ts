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
  }: IRequest): Promise<IResponse> {
    const book = await this.booksRepository.findById(bookId)
    if (!book) throw makeErrorBookNotFound()
    if (!book.capitules) throw makeErrorReorderValues()

    await this.verifyPermissions.verify({
      projectId: book.project_id,
      userId,
      verifyPermissionTo: 'edit',
    })

    const capituleToUpdate = await this.capitulesRepository.findById(capituleId)
    if (!capituleToUpdate) throw makeErrorCapituleNotFound()
    if (!capituleToUpdate.scenes) throw makeErrorReorderValues()

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

    if (isInvalidSequenceTo) throw makeErrorReorderValues()

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

    return { scenes }
  }
}
