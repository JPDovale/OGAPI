import { container } from 'tsyringe'

import { type ICacheProvider } from './CacheProvider/ICacheProvider'
import { RedisCacheProvider } from './CacheProvider/implementations/RedisCacheProvider'
import { type IDateProvider } from './DateProvider/IDateProvider'
import { DayJsDateProvider } from './DateProvider/implementations/DayJsDateProvider'
import { type IMailProvider } from './MailProvider/IMailProvider'
import { EtherealMailProvider } from './MailProvider/implementations/EtherealMailProvider'
import { MailGunProvider } from './MailProvider/implementations/MailGunProvider'
import { NotifyUsersProvider } from './NotifyUsersProvider/implementations/NotifyUsersProvider'
import { type INotifyUsersProvider } from './NotifyUsersProvider/INotifyUsersProvider'
import { FirebaseStorageProvider } from './StorageProvider/implementations/FirebaseStorageProvider'
import { type IStorageProvider } from './StorageProvider/IStorageProvider'

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

container.registerSingleton<ICacheProvider>('CacheProvider', RedisCacheProvider)
