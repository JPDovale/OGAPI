import { container } from 'tsyringe'
import { v4 as uuidV4 } from 'uuid'

import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider'

const dateProvider = container.resolve(DayJsDateProvider)

export interface INotification {
  id: string
  projectId: string
  sendedPerUser: string
  title: string
  isVisualized: boolean
  content: string
  createAt: string
}

interface INotificationConstructor {
  id?: string
  projectId: string
  sendedPerUser: string
  title: string
  isVisualized?: boolean
  content: string
  createAt?: string
}

export class Notification {
  id: string
  projectId: string
  sendedPerUser: string
  title: string
  isVisualized: boolean
  content: string
  createAt: string

  constructor(notification: INotificationConstructor) {
    this.id = notification.id ?? uuidV4()
    this.projectId = notification.projectId
    this.sendedPerUser = notification.sendedPerUser
    this.content = notification.content
    this.isVisualized = notification.isVisualized ?? false
    this.title = notification.title
    this.createAt = notification.createAt ?? dateProvider.getDate(new Date())
  }
}
