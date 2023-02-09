import { container } from 'tsyringe'

import { VerifyPermissions } from './verifyPermissions/implementations/VerifyPermissions'
import { IVerifyPermissionsService } from './verifyPermissions/IVerifyPermissions'

container.registerSingleton<IVerifyPermissionsService>(
  'VerifyPermissions',
  VerifyPermissions,
)
