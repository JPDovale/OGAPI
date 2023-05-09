import { type KeysUnchecked, type IKeysRedis } from './types/Keys'

export abstract class ICacheProvider {
  abstract setInfo<T>(
    key: {
      key: IKeysRedis
      objectId: string
    },
    value: T,
    validateInSeconds?: number,
  ): Promise<void>
  abstract getInfo<T>(key: {
    key: IKeysRedis
    objectId: string
  }): Promise<T | null>
  abstract refresh(): Promise<void>
  abstract delete(
    key: { key: IKeysRedis; objectId: string } | KeysUnchecked,
  ): Promise<void>
  abstract deleteMany(keys: KeysUnchecked[]): Promise<void>
}
