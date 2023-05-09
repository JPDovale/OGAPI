import { container } from 'tsyringe'

import { Services } from '../types/Services'
import { VerifyPermissions } from './verifyPermissions/implementations/VerifyPermissions'
import { type IVerifyPermissionsService } from './verifyPermissions/IVerifyPermissions'

container.registerSingleton<IVerifyPermissionsService>(
  Services.VerifyPermissions,
  VerifyPermissions,
)
