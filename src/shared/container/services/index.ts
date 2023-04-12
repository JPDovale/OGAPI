import { container } from 'tsyringe'

import { VerifyPermissions } from './verifyPermissions/implementations/VerifyPermissions'
import { type IVerifyPermissionsService } from './verifyPermissions/IVerifyPermissions'

container.registerSingleton<IVerifyPermissionsService>(
  'VerifyPermissions',
  VerifyPermissions,
)
