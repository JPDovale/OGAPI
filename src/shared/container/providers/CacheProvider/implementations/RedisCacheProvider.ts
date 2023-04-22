import { inject, injectable } from 'tsyringe'

import { redisClient } from '@config/redis'
import { type IProject } from '@modules/projects/infra/repositories/entities/IProject'
import InjectableDependencies from '@shared/container/types'

import { IDateProvider } from '../../DateProvider/IDateProvider'
import { type ICacheProvider } from '../ICacheProvider'
import { type ICacheSaved } from '../types/ICacheSaved'
import { KeysRedis } from '../types/Keys'

@injectable()
export class RedisCacheProvider implements ICacheProvider {
  constructor(
    @inject(InjectableDependencies.Providers.DateProvider)
    private readonly dateProvider: IDateProvider,
  ) {}

  async setInfo<T>(
    key: string,
    value: T,
    validateInSeconds?: number,
  ): Promise<void> {
    const cacheEndDate = this.dateProvider.addSeconds(
      validateInSeconds ?? 60 * 30,
    ) // 30 min

    const valueToSave: ICacheSaved<T> = {
      endDate: cacheEndDate.toString(),
      data: value,
    }

    const valueToSaveStringed = JSON.stringify(valueToSave)
    await redisClient.set(key, valueToSaveStringed)
  }

  async getInfo<T>(key: string): Promise<T | null> {
    const value = await redisClient.get(key)

    if (!value) return null

    const object: ICacheSaved<T> = JSON.parse(value)

    const validateOfCacheExpire = this.dateProvider.isBefore({
      startDate: new Date(object.endDate),
      endDate: new Date(),
    })

    if (validateOfCacheExpire) {
      await redisClient.del(key)
      return null
    }

    return object.data
  }

  async refresh(): Promise<void> {
    await redisClient.flushdb()
  }

  async delete(key: string): Promise<void> {
    await redisClient.del(key)
  }

  async cleanCacheOfOneProject(project: IProject): Promise<void> {
    const usersWithPermissionToComment =
      project.users_with_access_comment?.users ?? []
    const usersWithPermissionToEdit =
      project.users_with_access_edit?.users ?? []
    const usersWithPermissionToView =
      project.users_with_access_view?.users ?? []

    const usersToCleanCache = [
      ...usersWithPermissionToComment,
      ...usersWithPermissionToEdit,
      ...usersWithPermissionToView,
    ]

    await redisClient.del(KeysRedis.project + project.id)

    Promise.all(
      usersToCleanCache.map(async (user) => {
        await redisClient.del(KeysRedis.userPreview + user.id)
        await redisClient.del(KeysRedis.userProjectsPreview + user.id)
      }),
    ).catch((err) => {
      console.log(err)
      throw err
    })
  }
}
