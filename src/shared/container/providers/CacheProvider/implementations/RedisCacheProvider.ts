import { inject, injectable } from 'tsyringe'

import { redisClient } from '@config/redis'

import { IDateProvider } from '../../DateProvider/IDateProvider'
import { type ICacheProvider } from '../ICacheProvider'

@injectable()
export class RedisCacheProvider implements ICacheProvider {
  constructor(
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async setInfo(key: string, value: any): Promise<void> {
    const cacheEndDate = this.dateProvider.addDays(1)

    const valueToSave = JSON.stringify({ ...value, cacheEndDate })
    await redisClient.set(key, valueToSave)
  }

  async getInfo(key: string): Promise<any> {
    const value = await redisClient.get(key)
    const objectValue = JSON.parse(value)

    const validateOfCacheExpire = this.dateProvider.isBefore({
      startDate: objectValue?.cacheEndDate,
      endDate: new Date(),
    })

    if (validateOfCacheExpire) {
      await redisClient.del(key)
    }

    return objectValue
  }

  async refresh(): Promise<void> {
    await redisClient.flushdb()
  }

  async delete(key: string): Promise<void> {
    await redisClient.del(key)
  }
}
