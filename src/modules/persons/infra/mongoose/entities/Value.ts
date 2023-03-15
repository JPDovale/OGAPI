import { v4 as uuidV4 } from 'uuid'

interface IException {
  title: string
  description: string
}

export interface IValue {
  id: string
  title: string
  description: string
  exceptions: IException[]
}

interface IValueConstructor {
  id?: string
  title?: string
  description?: string
  exceptions?: IException[]
}

export class Value {
  id: string
  title: string
  description: string
  exceptions: IException[]

  constructor(value: IValueConstructor) {
    this.id = value.id ?? uuidV4()
    this.title = value.title ?? ''
    this.description = value.description ?? ''
    this.exceptions = value.exceptions ?? []
  }
}
