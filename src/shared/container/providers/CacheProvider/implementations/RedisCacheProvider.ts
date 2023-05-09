import { inject, injectable } from 'tsyringe'

import { redisClient } from '@config/redis'
import InjectableDependencies from '@shared/container/types'

import { IDateProvider } from '../../DateProvider/IDateProvider'
import { type ICacheProvider } from '../ICacheProvider'
import { type ICacheSaved } from '../types/ICacheSaved'
import { type KeysUnchecked, type IKeysRedis, KeysRedis } from '../types/Keys'

@injectable()
export class RedisCacheProvider implements ICacheProvider {
  constructor(
    @inject(InjectableDependencies.Providers.DateProvider)
    private readonly dateProvider: IDateProvider,
  ) {}

  async setInfo<T>(
    key: {
      key: IKeysRedis
      objectId: string
    },
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
    await redisClient.set(
      KeysRedis[key.key] + key.objectId,
      valueToSaveStringed,
    )
  }

  async getInfo<T>(key: {
    key: IKeysRedis
    objectId: string
  }): Promise<T | null> {
    const value = await redisClient.get(KeysRedis[key.key] + key.objectId)

    if (!value) return null

    const object: ICacheSaved<T> = JSON.parse(value)

    const validateOfCacheExpire = this.dateProvider.isBefore({
      startDate: new Date(object.endDate),
      endDate: new Date(),
    })

    if (validateOfCacheExpire) {
      await redisClient.del(KeysRedis[key.key] + key.objectId)
      return null
    }

    return object.data
  }

  async refresh(): Promise<void> {
    await redisClient.flushdb()
  }

  async delete(
    key: { key: IKeysRedis; objectId: string } | KeysUnchecked,
  ): Promise<void> {
    if (typeof key === 'object') {
      if (key.objectId === '*') {
        const keys = await redisClient.keys(KeysRedis[key.key] + key.objectId)
        await redisClient.del(...keys)
      } else {
        await redisClient.del(KeysRedis[key.key] + key.objectId)
      }
    } else {
      await redisClient.del(key)
    }
  }

  async deleteMany(keys: KeysUnchecked[]): Promise<void> {
    await redisClient.del(...keys)
  }
}
