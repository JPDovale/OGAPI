import { inject, injectable } from 'tsyringe'

import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { ICapitulesRepository } from '@modules/books/infra/repositories/contracts/ICapitulesRepository'
import { IScenesRepository } from '@modules/books/infra/repositories/contracts/IScenesRepository'
import { type IScene } from '@modules/books/infra/repositories/entities/IScene'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorBookNotUpdate } from '@shared/errors/books/makeErrorBookNotUpdate'
import { makeErrorCapituleNotFound } from '@shared/errors/books/makeErrorCapituleNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  bookId: string
  capituleId: string
  objective: string
  structure: {
    act1: string
    act2: string
    act3: string
  }
  persons: Array<{ id: string }>
}

interface IResponse {
  scene: IScene
}

@injectable()
export class CreateSceneUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BooksRepository)
    private readonly booksRepository: IBooksRepository,

    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,

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
    objective,
    structure,
    persons,
  }: IRequest): Promise<IResolve<IResponse>> {
    const book = await this.booksRepository.findById(bookId)
    if (!book) {
      return {
        ok: false,
        error: makeErrorBookNotFound(),
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

    const { project, user } = verification.data!

    const capituleToAddScene = await this.capitulesRepository.findById(
      capituleId,
    )

    if (!capituleToAddScene) {
      return {
        ok: false,
        error: makeErrorCapituleNotFound(),
      }
    }

    const numberOfScenesInCapitule = capituleToAddScene.scenes?.length ?? 0

    const scene = await this.scenesRepository.create({
      capitule_id: capituleId,
      objective,
      sequence: numberOfScenesInCapitule + 1,
      structure_act_1: structure.act1,
      structure_act_2: structure.act2,
      structure_act_3: structure.act3,
      persons: {
        connect: persons,
      },
    })

    if (!scene) {
      return {
        ok: false,
        error: makeErrorBookNotUpdate(),
      }
    }

    this.capitulesRepository
      .update({
        capituleId,
        data: {
          complete: false,
        },
      })
      .catch((err) => {
        return {
          ok: false,
          error: err,
        }
      })

    await this.notifyUsersProvider.notifyUsersInOneProject({
      project,
      creatorId: user.id,
      title: `${user.username} criou uma nova cena no capitulo: ${capituleToAddScene.name}`,
      content: `${user.username} acabou de criar uma nova cena no capitulo ${
        capituleToAddScene.name
      } no livro ${book.title}${
        book.subtitle ? ` ${book.subtitle}` : ''
      } dentro do projeto: ${project.name}. Acesse a aba 'Livros -> ${
        book.title
      } -> capítulos -> ${
        capituleToAddScene.name
      } -> cenas' para ver mais informações.`,
    })

    return {
      ok: true,
      data: {
        scene,
      },
    }
  }
}
