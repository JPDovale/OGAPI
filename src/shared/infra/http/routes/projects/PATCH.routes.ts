import { Router } from 'express'

import { ImageUpdateController } from '@modules/projects/controllers/ImageUpdateController'
import { PlotUpdateController } from '@modules/projects/controllers/PlotUpdateController'
import { ShareProjectController } from '@modules/projects/controllers/ShareProjectController'
import { UnshareProjectController } from '@modules/projects/controllers/UnshareProjectController'
import { UpdateNameController } from '@modules/projects/controllers/UpdateNameController'

import { Uploads } from '../../middlewares/upload'

export const projectsRoutesPatch = Router()

const shareProjectController = new ShareProjectController()
const unshareProjectController = new UnshareProjectController()
const imageUpdateController = new ImageUpdateController()
const plotUpdateController = new PlotUpdateController()
const updateNameController = new UpdateNameController()

const uploads = new Uploads('projects', 'image')

projectsRoutesPatch.patch('/:projectId/share', shareProjectController.handle)
projectsRoutesPatch.patch(
  '/:projectId/unshare',
  unshareProjectController.handle,
)
projectsRoutesPatch.patch(
  '/:projectId/image-update',
  uploads.upload.single('file'),
  imageUpdateController.handle,
)
projectsRoutesPatch.patch('/:projectId/plot', plotUpdateController.handle)
projectsRoutesPatch.patch('/:projectId/name', updateNameController.handle)
