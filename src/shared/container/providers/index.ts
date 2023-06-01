import { container } from 'tsyringe'

import { env } from '@env/index'

import { type ICacheProvider } from './CacheProvider/ICacheProvider'
import { RedisCacheProvider } from './CacheProvider/implementations/RedisCacheProvider'
import { type IDateProvider } from './DateProvider/IDateProvider'
import { DayJsDateProvider } from './DateProvider/implementations/DayJsDateProvider'
import { type IMailProvider } from './MailProvider/IMailProvider'
import { EtherealMailProvider } from './MailProvider/implementations/EtherealMailProvider'
import { SendinBlueProvider } from './MailProvider/implementations/SendinBlueProvider'
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

// container.registerInstance<IMailProvider>(
//   'EtherealMailProvider',
//   new EtherealMailProvider(),
// )

container.registerInstance<IMailProvider>(
  'MailGunProvider',
  !env.IS_DEV ? new EtherealMailProvider() : new SendinBlueProvider(),
)

container.registerSingleton<ICacheProvider>('CacheProvider', RedisCacheProvider)
