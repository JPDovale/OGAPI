// import { type Request, type Response } from 'express'
// import { container } from 'tsyringe'

// import { ListProjectsPerUserUseCase } from './ListProjectsPerUserUseCase'

// export class ListProjectsPerUserController {
//   async handle(req: Request, res: Response): Promise<Response> {
//     const { id } = req.user

//     const listProjectsPerUserUseCase = container.resolve(
//       ListProjectsPerUserUseCase,
//     )
//     const projectsThisUser = await listProjectsPerUserUseCase.execute(id)

//     return res.status(200).json(projectsThisUser)
//   }
// }
