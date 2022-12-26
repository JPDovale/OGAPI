import { v4 as uuidV4 } from 'uuid'

export interface IComment {
  userId: string
  username: string
  userAvata: string
  to: string
  content: string
  responses?: IResponse[]
  createAt?: string
  updateAt?: string
}

export interface IResponse {
  userId: string
  username: string
  userAvata: string
  content: string
  createAt?: string
  updateAt?: string
}

export class Response {
  id: string
  userId: string
  username: string
  userAvata: string
  content: string
  createAt: string
  updateAt: string

  constructor(response: IResponse) {
    this.id = uuidV4()
    this.userId = response.userId
    this.username = response.username
    this.userAvata = response.userAvata
    this.content = response.content
    this.createAt = response.createAt || new Date().toString()
    this.updateAt = response.updateAt || new Date().toString()
  }
}

export class Comment {
  id: string
  userId: string
  username: string
  userAvata: string
  to: string
  content: string
  responses?: IResponse[]
  createAt: string
  updateAt: string

  constructor(comment: IComment) {
    this.id = uuidV4()
    this.userId = comment.userId
    this.username = comment.username
    this.userAvata = comment.userAvata
    this.to = comment.to
    this.content = comment.content
    this.responses = comment.responses || []
    this.createAt = comment.createAt || new Date().toString()
    this.updateAt = comment.updateAt || new Date().toString()
  }
}
