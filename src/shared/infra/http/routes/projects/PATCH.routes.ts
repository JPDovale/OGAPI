import { Router } from 'express'

import { ChangeFeaturesUsingController } from '@modules/projects/controllers/ChangeFeaturesUsingController'
import { ImageUpdateController } from '@modules/projects/controllers/ImageUpdateController'
import { ShareProjectController } from '@modules/projects/controllers/ShareProjectController'
import { UnshareProjectController } from '@modules/projects/controllers/UnshareProjectController'
import { UpdateInitialDateController } from '@modules/projects/controllers/UpdateInitialDateController'
import { UpdateNameController } from '@modules/projects/controllers/UpdateNameController'

import { Uploads } from '../../middlewares/upload'

export const projectsRoutesPatch = Router()

const shareProjectController = new ShareProjectController()
const unshareProjectController = new UnshareProjectController()
const imageUpdateController = new ImageUpdateController()
const updateNameController = new UpdateNameController()
const chandeFeaturesUsingController = new ChangeFeaturesUsingController()
const updateInitialDateController = new UpdateInitialDateController()

const uploads = new Uploads('projects', 'image')

// PATH: api/projects
projectsRoutesPatch.patch('/:projectId/share', shareProjectController.handle)
projectsRoutesPatch.patch(
  '/:projectId/unshare',
  unshareProjectController.handle,
)
projectsRoutesPatch.patch(
  '/:projectId/image',
  uploads.upload.single('file'),
  imageUpdateController.handle,
)
projectsRoutesPatch.patch('/:projectId/name', updateNameController.handle)
projectsRoutesPatch.patch(
  '/:projectId/features',
  chandeFeaturesUsingController.handle,
)
projectsRoutesPatch.patch(
  '/:projectId/date',
  updateInitialDateController.handle,
)
