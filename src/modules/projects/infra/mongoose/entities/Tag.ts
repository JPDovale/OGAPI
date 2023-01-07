import { v4 as uuidV4 } from 'uuid'

import { DayJsDateProvider } from '@shared/container/provides/DateProvider/implementations/DayJsDateProvider'

const dateProvider = new DayJsDateProvider()
export interface ITag {
  id?: string
  type: string
  refs: IRef[]
  origPath: string
  createAt?: string
  updateAt?: string
}

interface IObject {
  id?: string
  title?: string
  description?: string
}

export interface IRef {
  object: IObject
  references: string[]
}

export class Tag {
  id: string
  type: string
  refs: IRef[]
  origPath: string
  createAt: string
  updateAt: string

  constructor(tag: ITag) {
    this.id = uuidV4()
    this.type = tag.type
    this.refs = tag.refs
    this.origPath = tag.origPath
    this.createAt = tag.createAt || dateProvider.getDate(new Date())
    this.updateAt = tag.updateAt || dateProvider.getDate(new Date())
  }
}
