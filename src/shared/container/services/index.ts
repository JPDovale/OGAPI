import { container } from 'tsyringe'

import { IBoxesControllers } from './boxesControllers/IBoxesControllers'
import { BoxesControllers } from './boxesControllers/implementations/BoxesControllers'
import { VerifyPermissions } from './verifyPermissions/implementations/VerifyPermissions'
import { IVerifyPermissionsService } from './verifyPermissions/IVerifyPermissions'

container.registerSingleton<IVerifyPermissionsService>(
  'VerifyPermissions',
  VerifyPermissions,
)

container.registerSingleton<IBoxesControllers>(
  'BoxesControllers',
  BoxesControllers,
)
