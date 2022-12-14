import { container } from 'tsyringe'

import { IDateProvider } from './DateProvider/IDateProvider'
import { DayJsDateProvider } from './DateProvider/implementations/DayJsDateProvider'
import { FirebaseStorageProvider } from './StorageProvider/implementations/FirebaseStorageProvider'
import { IStorageProvider } from './StorageProvider/IStorageProvider'

container.registerSingleton<IDateProvider>('DateProvider', DayJsDateProvider)

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  FirebaseStorageProvider,
)
