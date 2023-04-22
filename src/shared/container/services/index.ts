import { container } from 'tsyringe'

import { Services } from '../types/Services'
import { UsersServices } from './usersServices/implementations/UsersServices'
import { type IUsersServices } from './usersServices/IUsersServices'
import { VerifyPermissions } from './verifyPermissions/implementations/VerifyPermissions'
import { type IVerifyPermissionsService } from './verifyPermissions/IVerifyPermissions'

container.registerSingleton<IVerifyPermissionsService>(
  Services.VerifyPermissions,
  VerifyPermissions,
)

container.registerSingleton<IUsersServices>(
  Services.UsersServices,
  UsersServices,
)
