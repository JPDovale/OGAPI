import { Router } from 'express'

import { CommentInPlotProjectController } from '@modules/projects/useCases/commentInPlotProject/CommentInPlotProjectController'
import { CreateProjectController } from '@modules/projects/useCases/createProject/createProjectController'
import { DeleteImageController } from '@modules/projects/useCases/deleteImage/DeleteImageController'
import { DeleteProjectController } from '@modules/projects/useCases/deleteProject/DeleteProjectController'
import { ImageUpdateController } from '@modules/projects/useCases/imageUpdate/ImageUpdateController'
import { ListProjectsPerUserController } from '@modules/projects/useCases/listProjectsPerUser/ListProjectsPerUserController'
import { PlotUpdateController } from '@modules/projects/useCases/plotUpdate/PlotUpdateController'
import { QuitProjectController } from '@modules/projects/useCases/quitProject/QuitProjectController'
import { ResponseCommentPlotProjectController } from '@modules/projects/useCases/responseCommentPlotProject/ResponseCommentPlotProjectController'
import { ShareProjectController } from '@modules/projects/useCases/shareProject/ShareProjectController'
import { UnshareProjectController } from '@modules/projects/useCases/unshareProject/UnshareProjectController'
import { UpdateNameController } from '@modules/projects/useCases/updateName/UpdateNameController'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'
import { Uploads } from '../middlewares/upload'

export const projectsRoutes = Router()

const createProjectController = new CreateProjectController()
const listProjectsPerUserController = new ListProjectsPerUserController()
const shareProjectController = new ShareProjectController()
const unshareProjectController = new UnshareProjectController()
const imageUpdateController = new ImageUpdateController()
const deleteProjectController = new DeleteProjectController()
const plotUpdateController = new PlotUpdateController()
const commentInPlotProjectController = new CommentInPlotProjectController()
const responseCommentPlotProject = new ResponseCommentPlotProjectController()
const deleteImageController = new DeleteImageController()
const quitProjectController = new QuitProjectController()
const updateNameController = new UpdateNameController()

const uploads = new Uploads('projects', 'image')

projectsRoutes.use(ensureAuthenticated)
projectsRoutes.post('/', createProjectController.handle)
projectsRoutes.get('/', listProjectsPerUserController.handle)
projectsRoutes.patch('/share', shareProjectController.handle)
projectsRoutes.patch('/unshare', unshareProjectController.handle)
projectsRoutes.patch(
  '/image-update/:projectId',
  uploads.upload.single('file'),
  imageUpdateController.handle,
)
projectsRoutes.delete('/image/:projectId', deleteImageController.handle)
projectsRoutes.patch('/', deleteProjectController.handle)
projectsRoutes.patch('/plot/:projectId', plotUpdateController.handle)
projectsRoutes.post('/plot/comments', commentInPlotProjectController.handle)
projectsRoutes.post(
  '/plot/comments/response',
  responseCommentPlotProject.handle,
)
projectsRoutes.put('/quit', quitProjectController.handle)
projectsRoutes.patch('/name', updateNameController.handle)
