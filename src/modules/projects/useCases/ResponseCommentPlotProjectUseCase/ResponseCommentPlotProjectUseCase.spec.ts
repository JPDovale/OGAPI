// import 'reflect-metadata'

// import { beforeEach, describe, expect, it } from 'vitest'

// import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
// import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
// import { PlotProject } from '@modules/projects/infra/mongoose/entities/Plot'
// import { type IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
// import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
// import { type ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
// import { RedisCacheProvider } from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider'
// import { type IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
// import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider'
// import { NotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/implementations/NotifyUsersProvider'
// import { type INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
// import { VerifyPermissions } from '@shared/container/services/verifyPermissions/implementations/VerifyPermissions'
// import { type IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
// import { AppError } from '@shared/errors/AppError'

// import { ResponseCommentPlotProjectUseCase } from './ResponseCommentPlotProjectUseCase'

// let projectsRepositoryInMemory: IProjectsRepository
// let usersRepositoryInMemory: IUsersRepository

// let dateProvider: IDateProvider
// let notifyUsersProvider: INotifyUsersProvider
// let cacheProvider: ICacheProvider

// let verifyPermissionsService: IVerifyPermissionsService

// let responseCommentPlotProjectUseCase: ResponseCommentPlotProjectUseCase

// describe('Response comment in plot', () => {
//   beforeEach(() => {
//     projectsRepositoryInMemory = new ProjectsRepositoryInMemory()
//     usersRepositoryInMemory = new UserRepositoryInMemory()

//     dateProvider = new DayJsDateProvider()
//     cacheProvider = new RedisCacheProvider(dateProvider)
//     notifyUsersProvider = new NotifyUsersProvider(
//       usersRepositoryInMemory,
//       cacheProvider,
//     )

//     verifyPermissionsService = new VerifyPermissions(
//       projectsRepositoryInMemory,
//       usersRepositoryInMemory,
//     )

//     responseCommentPlotProjectUseCase = new ResponseCommentPlotProjectUseCase(
//       projectsRepositoryInMemory,
//       notifyUsersProvider,
//       verifyPermissionsService,
//     )
//   })

//   it('should be able to response comment in plot project', async () => {
//     const user = await usersRepositoryInMemory.create({
//       age: '2312',
//       email: 'test@test.com',
//       name: 'test',
//       password: 'test',
//       sex: 'male',
//       username: 'test',
//     })

//     const userToComment = await usersRepositoryInMemory.create({
//       age: '2312',
//       email: 'testUserComment@test.com',
//       name: 'test',
//       password: 'test',
//       sex: 'male',
//       username: 'test',
//     })

//     const newProjectTest = await projectsRepositoryInMemory.create({
//       name: 'test',
//       private: false,
//       type: 'book',
//       createdPerUser: user.id,
//       users: [
//         {
//           email: user.email,
//           id: user.id,
//           permission: 'edit',
//         },
//         {
//           email: userToComment.email,
//           id: userToComment.id,
//           permission: 'comment',
//         },
//       ],
//       plot: {
//         ...new PlotProject({}),
//         comments: [
//           {
//             id: '1212121',
//             content: 'comentário teste',
//             to: 'onePhrase',
//             userId: userToComment.id,
//             username: userToComment.username,
//             responses: [],
//           },
//         ],
//       },
//     })

//     await responseCommentPlotProjectUseCase.execute(
//       user.id,
//       newProjectTest.id,
//       '1212121',
//       { content: 'Resposta teste' },
//     )
//     const projectWhitComment = await projectsRepositoryInMemory.findById(
//       newProjectTest.id,
//     )

//     expect(projectWhitComment.plot.comments[0].responses.length).toEqual(1)
//     expect(projectWhitComment.plot.comments[0].responses[0].content).toEqual(
//       'Resposta teste',
//     )
//   })

//   it('should be able automatically notify users on project about response on comment', async () => {
//     const user = await usersRepositoryInMemory.create({
//       age: '2312',
//       email: 'test@test.com',
//       name: 'test',
//       password: 'test',
//       sex: 'male',
//       username: 'test',
//     })

//     const userToComment = await usersRepositoryInMemory.create({
//       age: '2312',
//       email: 'testUserComment@test.com',
//       name: 'test',
//       password: 'test',
//       sex: 'male',
//       username: 'test',
//     })

//     const newProjectTest = await projectsRepositoryInMemory.create({
//       name: 'test',
//       private: false,
//       type: 'book',
//       createdPerUser: user.id,
//       users: [
//         {
//           email: user.email,
//           id: user.id,
//           permission: 'edit',
//         },
//         {
//           email: userToComment.email,
//           id: userToComment.id,
//           permission: 'comment',
//         },
//       ],
//       plot: {
//         ...new PlotProject({}),
//         comments: [
//           {
//             id: '1212121',
//             content: 'comentário teste',
//             to: 'onePhrase',
//             userId: userToComment.id,
//             username: userToComment.username,
//             responses: [],
//           },
//         ],
//       },
//     })

//     await responseCommentPlotProjectUseCase.execute(
//       user.id,
//       newProjectTest.id,
//       '1212121',
//       { content: 'Resposta teste' },
//     )
//     const userNotified = await usersRepositoryInMemory.findById(
//       userToComment.id,
//     )

//     expect(userNotified.notifications.length).toEqual(1)
//     expect(userNotified.notifications[0].title).toEqual(
//       'test respondeu o comentário em onePhrase',
//     )
//     expect(userNotified.notifications[0].content).toEqual(
//       'test acabou de responder o comentário "comentário teste" em onePhrase: Resposta teste',
//     )
//   })

//   it('should be able automatically notify users on project about response on comment when user is creator of comment', async () => {
//     const user = await usersRepositoryInMemory.create({
//       age: '2312',
//       email: 'test@test.com',
//       name: 'test',
//       password: 'test',
//       sex: 'male',
//       username: 'test',
//     })

//     const userToComment = await usersRepositoryInMemory.create({
//       age: '2312',
//       email: 'testUserComment@test.com',
//       name: 'test',
//       password: 'test',
//       sex: 'male',
//       username: 'test2',
//     })

//     const newProjectTest = await projectsRepositoryInMemory.create({
//       name: 'test',
//       private: false,
//       type: 'book',
//       createdPerUser: user.id,
//       users: [
//         {
//           email: user.email,
//           id: user.id,
//           permission: 'edit',
//         },
//         {
//           email: userToComment.email,
//           id: userToComment.id,
//           permission: 'comment',
//         },
//       ],
//       plot: {
//         ...new PlotProject({}),
//         comments: [
//           {
//             id: '1212121',
//             content: 'comentário teste',
//             to: 'onePhrase',
//             userId: userToComment.id,
//             username: userToComment.username,
//             responses: [],
//           },
//         ],
//       },
//     })

//     await responseCommentPlotProjectUseCase.execute(
//       userToComment.id,
//       newProjectTest.id,
//       '1212121',
//       { content: 'Resposta teste' },
//     )
//     const userNotified = await usersRepositoryInMemory.findById(user.id)

//     expect(userNotified.notifications.length).toEqual(1)
//     expect(userNotified.notifications[0].title).toEqual(
//       'test2 respondeu o próprio comentário em onePhrase',
//     )
//     expect(userNotified.notifications[0].content).toEqual(
//       'test2 acabou de responder o próprio comentário "comentário teste" em onePhrase: Resposta teste',
//     )
//   })

//   it("not should be able comment if user doesn't not permission", async () => {
//     expect(async () => {
//       const user = await usersRepositoryInMemory.create({
//         age: '2312',
//         email: 'test@test.com',
//         name: 'test',
//         password: 'test',
//         sex: 'male',
//         username: 'test',
//       })

//       const userToComment = await usersRepositoryInMemory.create({
//         age: '2312',
//         email: 'testUserComment@test.com',
//         name: 'test',
//         password: 'test',
//         sex: 'male',
//         username: 'test',
//       })

//       const newProjectTest = await projectsRepositoryInMemory.create({
//         name: 'test',
//         private: false,
//         type: 'book',
//         createdPerUser: user.id,
//         users: [
//           {
//             email: user.email,
//             id: user.id,
//             permission: 'edit',
//           },
//           {
//             email: userToComment.email,
//             id: userToComment.id,
//             permission: 'comment',
//           },
//         ],
//         plot: {
//           ...new PlotProject({}),
//           comments: [
//             {
//               id: '1212121',
//               content: 'comentário teste',
//               to: 'onePhrase',
//               userId: userToComment.id,
//               username: userToComment.username,
//               responses: [],
//             },
//           ],
//         },
//       })

//       await responseCommentPlotProjectUseCase.execute(
//         user.id,
//         newProjectTest.id,
//         '1212121',
//         { content: 'Resposta teste' },
//       )
//     })
//       .rejects.toBeInstanceOf(AppError)
//       .catch((err) => {
//         throw err
//       })
//   })
// })
