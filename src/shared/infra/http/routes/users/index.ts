import { Router } from 'express'

import { userRoutesDelete } from './DELETE.routes'
import { userRoutesGet } from './GET.routes'
import { userRoutesPatch } from './PATCH.routes'
import { userRoutesPost } from './POST.routes'

export const userRoutes = Router()

userRoutes.use(userRoutesGet)
userRoutes.use(userRoutesPost)
userRoutes.use(userRoutesPatch)
userRoutes.use(userRoutesDelete)
