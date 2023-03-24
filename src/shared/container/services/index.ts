import { container } from 'tsyringe'

import { type IBoxesControllers } from './boxesControllers/IBoxesControllers'
import { BoxesControllers } from './boxesControllers/implementations/BoxesControllers'
import { VerifyPermissions } from './verifyPermissions/implementations/VerifyPermissions'
import { type IVerifyPermissionsService } from './verifyPermissions/IVerifyPermissions'

container.registerSingleton<IVerifyPermissionsService>(
  'VerifyPermissions',
  VerifyPermissions,
)

container.registerSingleton<IBoxesControllers>(
  'BoxesControllers',
  BoxesControllers,
)
