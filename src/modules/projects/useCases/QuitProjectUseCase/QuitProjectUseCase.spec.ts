// import 'reflect-metadata'
// import { beforeEach, describe, expect, it } from 'vitest'

// import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
// import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
// import { type IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
// import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/inMemory/ProjectsRepositoryInMemory'
// import { type ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
// import { RedisCacheProvider } from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider'
// import { type IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
// import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider'
// import { NotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/implementations/NotifyUsersProvider'
// import { type INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
// import { AppError } from '@shared/errors/AppError'

// import { QuitProjectUseCase } from './QuitProjectUseCase'

// let usersRepositoryInMemory: IUsersRepository
// let projectsRepositoryInMemory: IProjectsRepository

// let dateProvider: IDateProvider
// let cacheProvider: ICacheProvider
// let notifyUsersProvider: INotifyUsersProvider

// let quitProjectUseCase: QuitProjectUseCase

// describe('Quit project', () => {
//   beforeEach(() => {
//     usersRepositoryInMemory = new UserRepositoryInMemory()
//     projectsRepositoryInMemory = new ProjectsRepositoryInMemory()

//     dateProvider = new DayJsDateProvider()
//     cacheProvider = new RedisCacheProvider(dateProvider)
//     notifyUsersProvider = new NotifyUsersProvider(
//       usersRepositoryInMemory,
//       cacheProvider,
//     )

//     quitProjectUseCase = new QuitProjectUseCase(
//       usersRepositoryInMemory,
//       projectsRepositoryInMemory,
//       notifyUsersProvider,
//     )
//   })

//   it('should be able to quit of project', async () => {
//     const user = await usersRepositoryInMemory.create({
//       age: '2312',
//       email: 'test@test.com',
//       name: 'test',
//       password: 'test',
//       sex: 'male',
//       username: 'test',
//     })

//     const user2 = await usersRepositoryInMemory.create({
//       age: '2312',
//       email: 'testUser2@test.com',
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
//           email: user2.email,
//           id: user2.id,
//           permission: 'edit',
//         },
//       ],
//       plot: {},
//     })

//     await quitProjectUseCase.execute({
//       userId: user2.id,
//       projectId: newProjectTest.id,
//     })

//     const updatedProject = await projectsRepositoryInMemory.findById(
//       newProjectTest.id,
//     )

//     expect(updatedProject.users.length).toEqual(1)
//   })

//   it('should be able notify users on project when user quit project', async () => {
//     const user = await usersRepositoryInMemory.create({
//       age: '2312',
//       email: 'test@test.com',
//       name: 'test',
//       password: 'test',
//       sex: 'male',
//       username: 'test',
//     })

//     const user2 = await usersRepositoryInMemory.create({
//       age: '2312',
//       email: 'testUser2@test.com',
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
//           email: user2.email,
//           id: user2.id,
//           permission: 'edit',
//         },
//       ],
//       plot: {},
//     })

//     await quitProjectUseCase.execute({
//       userId: user2.id,
//       projectId: newProjectTest.id,
//     })

//     const updatedProject = await projectsRepositoryInMemory.findById(
//       newProjectTest.id,
//     )
//     const notifiedUser = await usersRepositoryInMemory.findById(user.id)

//     expect(updatedProject.users.length).toEqual(1)
//     expect(notifiedUser.notifications.length).toEqual(1)
//   })

//   it('not should be able quit project if user is creator', async () => {
//     expect(async () => {
//       const user = await usersRepositoryInMemory.create({
//         age: '2312',
//         email: 'test@test.com',
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
//         ],
//         plot: {},
//       })

//       await quitProjectUseCase.execute({
//         userId: user.id,
//         projectId: newProjectTest.id,
//       })
//     })
//       .rejects.toBeInstanceOf(AppError)
//       .catch((err) => {
//         throw err
//       })
//   })
// })
