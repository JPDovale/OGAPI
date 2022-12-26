import { v4 as uuidV4 } from 'uuid'

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
    this.createAt = tag.createAt || new Date().toString()
    this.updateAt = tag.updateAt || new Date().toString()
  }
}
