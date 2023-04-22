import { type IProject } from '@modules/projects/infra/repositories/entities/IProject'

export abstract class ICacheProvider {
  abstract setInfo<T>(
    key: string,
    value: T,
    validateInSeconds?: number,
  ): Promise<void>
  abstract getInfo<T>(key: string): Promise<T | null>
  abstract refresh(): Promise<void>
  abstract delete(key: string): Promise<void>
  abstract cleanCacheOfOneProject(project: IProject): Promise<void>
}
