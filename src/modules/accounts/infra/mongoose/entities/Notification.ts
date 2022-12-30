import { v4 as uuidV4 } from 'uuid'

export interface INotification {
  id?: string
  title: string
  content: string
  createAt?: string
}

export class Notification {
  id: string
  title: string
  content: string
  createAt: string

  constructor(newNotification: INotification) {
    this.id = uuidV4()
    this.content = newNotification.content
    this.title = newNotification.title
    this.createAt = new Date().toString()
  }
}
