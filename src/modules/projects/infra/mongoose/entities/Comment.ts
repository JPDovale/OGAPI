import { container } from 'tsyringe'
import { v4 as uuidV4 } from 'uuid'

import { DayJsDateProvider } from '@shared/container/provides/DateProvider/implementations/DayJsDateProvider'

const dateProvider = container.resolve(DayJsDateProvider)

export interface IComment {
  userId: string
  username: string
  to: string
  content: string
  responses?: IResponse[]
  createAt?: string
  updateAt?: string
}

export interface IResponse {
  userId: string
  username: string
  content: string
  createAt?: string
  updateAt?: string
}

export class Response {
  id: string
  userId: string
  username: string
  content: string
  createAt: string
  updateAt: string

  constructor(response: IResponse) {
    this.id = uuidV4()
    this.userId = response.userId
    this.username = response.username
    this.content = response.content
    this.createAt = response.createAt || dateProvider.getDate(new Date())
    this.updateAt = response.updateAt || dateProvider.getDate(new Date())
  }
}

export class Comment {
  id: string
  userId: string
  username: string
  to: string
  content: string
  responses?: IResponse[]
  createAt: string
  updateAt: string

  constructor(comment: IComment) {
    this.id = uuidV4()
    this.userId = comment.userId
    this.username = comment.username
    this.to = comment.to
    this.content = comment.content
    this.responses = comment.responses || []
    this.createAt = comment.createAt || dateProvider.getDate(new Date())
    this.updateAt = comment.updateAt || dateProvider.getDate(new Date())
  }
}
