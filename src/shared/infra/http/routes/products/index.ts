import { Router } from 'express'

import { productsRoutesGet } from './GET.routes'
import { productsRoutesPost } from './POST.routes'

export const productsRoutes = Router()

productsRoutes.use('/', productsRoutesGet)
productsRoutes.use('/', productsRoutesPost)
