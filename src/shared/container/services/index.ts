import { container } from 'tsyringe'

import { Services } from '../types/Services'
import { StripeService } from './ProductsService/implementations/StripeService'
import { type IProductsService } from './ProductsService/IProductsService'
import { VerifyPermissions } from './verifyPermissions/implementations/VerifyPermissions'
import { type IVerifyPermissionsService } from './verifyPermissions/IVerifyPermissions'

container.registerSingleton<IVerifyPermissionsService>(
  Services.VerifyPermissions,
  VerifyPermissions,
)

container.registerSingleton<IProductsService>(
  Services.ProductsService,
  StripeService,
)
