import { container } from 'tsyringe'
import { v4 as uuidV4 } from 'uuid'

import { DayJsDateProvider } from '@shared/container/provides/DateProvider/implementations/DayJsDateProvider'

const dateProvider = container.resolve(DayJsDateProvider)

export interface INotification {
  id?: string
  projectId: string
  sendedPerUser: string
  title: string
  content: string
  createAt?: string
}

export class Notification {
  id: string
  projectId: string
  sendedPerUser: string
  title: string
  content: string
  createAt: string

  constructor(newNotification: INotification) {
    this.id = uuidV4()
    this.projectId = newNotification.projectId
    this.sendedPerUser = newNotification.sendedPerUser
    this.content = newNotification.content
    this.title = newNotification.title
    this.createAt = dateProvider.getDate(new Date())
  }
}
