import { container } from 'tsyringe'

import { IDateProvider } from './DateProvider/IDateProvider'
import { DayJsDateProvider } from './DateProvider/implementations/DayJsDateProvider'
import { IMailProvider } from './MailProvider/IMailProvider'
import { EtherealMailProvider } from './MailProvider/implementations/EtherealMailProvider'
import { MailGunProvider } from './MailProvider/implementations/MailGunProvider'
import { NotifyUsersProvider } from './NotifyUsersProvider/implementations/NotifyUsersProvider'
import { INotifyUsersProvider } from './NotifyUsersProvider/INotifyUsersProvider'
import { FirebaseStorageProvider } from './StorageProvider/implementations/FirebaseStorageProvider'
import { IStorageProvider } from './StorageProvider/IStorageProvider'

container.registerSingleton<IDateProvider>('DateProvider', DayJsDateProvider)

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  FirebaseStorageProvider,
)

container.registerSingleton<INotifyUsersProvider>(
  'NotifyUsersProvider',
  NotifyUsersProvider,
)

container.registerInstance<IMailProvider>(
  'EtherealMailProvider',
  new EtherealMailProvider(),
)

container.registerInstance<IMailProvider>(
  'MailGunProvider',
  new MailGunProvider(),
)
