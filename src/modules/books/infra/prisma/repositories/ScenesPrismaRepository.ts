import { inject, injectable } from 'tsyringe'

import { type ICreateSceneDTO } from '@modules/books/dtos/ICreateSceneDTO'
import { type IUpdateManyScenesDTO } from '@modules/books/dtos/IUpdateManyScenesDTO'
import { type IUpdateSceneDTO } from '@modules/books/dtos/IUpdateSceneDTO'
import { type Prisma } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { prisma } from '@shared/infra/database/createConnection'

import { type IScenesRepository } from '../../repositories/contracts/IScenesRepository'
import { type IScene } from '../../repositories/entities/IScene'

@injectable()
export class ScenesPrismaRepository implements IScenesRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async create(data: ICreateSceneDTO): Promise<IScene | null> {
    const scene = await prisma.scene.create({
      data,
      include: {
        persons: true,
        capitule: {
          select: {
            book_id: true,
          },
        },
      },
    })

    if (scene) {
      Promise.all([
        this.cacheProvider.deleteMany([
          `capitule-${scene.capitule_id}`,
          `book-${scene.capitule.book_id}`,
        ]),
      ]).catch((err) => {
        throw err
      })
    }

    return scene
  }

  async findById(sceneId: string): Promise<IScene | null> {
    const scene = await prisma.scene.findUnique({
      where: {
        id: sceneId,
      },
      include: {
        persons: true,
      },
    })

    if (scene) {
      this.cacheProvider
        .delete({
          key: 'capitule',
          objectId: scene.capitule_id,
        })
        .catch((err) => {
          throw err
        })
    }

    return scene
  }

  async updateMany(data: IUpdateManyScenesDTO): Promise<void> {
    const factoryDataWithObjectsPossibleNull: Array<Prisma.SceneUpdateArgs | null> =
      data.map((update) => {
        if (!update) return null

        return {
          where: {
            id: update.sceneId,
          },
          data: update.data,
        }
      })

    const factoryData: Prisma.SceneUpdateArgs[] =
      factoryDataWithObjectsPossibleNull.filter(
        (update): update is Prisma.SceneUpdateArgs => update !== null,
      )

    await prisma.$transaction(
      factoryData.map((update) => prisma.scene.update(update)),
    )
  }

  async update({ data, sceneId }: IUpdateSceneDTO): Promise<IScene | null> {
    const scene = await prisma.scene.update({
      where: {
        id: sceneId,
      },
      data,
      include: {
        persons: true,
      },
    })

    if (scene) {
      this.cacheProvider
        .delete({
          key: 'capitule',
          objectId: scene.capitule_id,
        })
        .catch((err) => {
          throw err
        })
    }

    return scene
  }
}
