// import 'reflect-metadata'
// import { beforeEach, describe, expect, it } from 'vitest'

// import { UserRepositoryInMemory } from '@modules/accounts/infra/mongoose/repositories/inMemory/UserRepositoryInMemory'
// import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
// import { BoxesRepositoryInMemory } from '@modules/boxes/infra/mongoose/repositories/inMemory/BoxesRepositoryInMemory'
// import { type IBoxesRepository } from '@modules/boxes/infra/repositories/contracts/IBoxesRepository'
// import { AppError } from '@shared/errors/AppError'

// import { UpdateBoxUseCase } from './UpdateBoxUseCase'

// let usersRepositoryInMemory: IUsersRepository
// let boxesRepositoryInMemory: IBoxesRepository

// let updateBoxUseCase: UpdateBoxUseCase

// describe('Update archive', () => {
//   beforeEach(() => {
//     usersRepositoryInMemory = new UserRepositoryInMemory()
//     boxesRepositoryInMemory = new BoxesRepositoryInMemory()

//     updateBoxUseCase = new UpdateBoxUseCase(boxesRepositoryInMemory)
//   })

//   it('Should be able to update box name', async () => {
//     const user = await usersRepositoryInMemory.create({
//       name: 'teste',
//       age: 'teste',
//       email: 'teste@test.com',
//       password: 'teste',
//       sex: 'teste',
//       username: 'teste',
//     })

//     const box = await boxesRepositoryInMemory.create({
//       internal: false,
//       name: 'test box',
//       tags: [{ name: 'test' }],
//       userId: user!.id,
//     })

//     const { box: boxUpdated } = await updateBoxUseCase.execute({
//       boxId: box!.id,
//       name: 'novo nome',
//     })

//     expect(boxUpdated.name).toEqual('novo nome')
//   })

//   it('Should be able to update box description', async () => {
//     const user = await usersRepositoryInMemory.create({
//       name: 'teste',
//       age: 'teste',
//       email: 'teste@test.com',
//       password: 'teste',
//       sex: 'teste',
//       username: 'teste',
//     })

//     const box = await boxesRepositoryInMemory.create({
//       internal: false,
//       name: 'test box',
//       description: 'box description',
//       tags: [{ name: 'test' }],
//       userId: user!.id,
//     })

//     const { box: boxUpdated } = await updateBoxUseCase.execute({
//       boxId: box!.id,
//       description: 'teste supremo',
//     })

//     expect(boxUpdated.description).toEqual('teste supremo')
//   })

//   it('Should be able to update box tags', async () => {
//     const user = await usersRepositoryInMemory.create({
//       name: 'teste',
//       age: 'teste',
//       email: 'teste@test.com',
//       password: 'teste',
//       sex: 'teste',
//       username: 'teste',
//     })

//     const box = await boxesRepositoryInMemory.create({
//       internal: false,
//       name: 'test box',
//       description: 'box description',
//       tags: [{ name: 'test' }],
//       userId: user!.id,
//     })

//     const { box: boxUpdated } = await updateBoxUseCase.execute({
//       boxId: box!.id,
//       tags: [{ name: 'test' }, { name: 'test2' }],
//     })

//     expect(boxUpdated.tags.length).toEqual(2)
//     expect(boxUpdated.tags[1].name).toEqual('test2')
//   })

//   it('Should be able to update box', async () => {
//     const user = await usersRepositoryInMemory.create({
//       name: 'teste',
//       age: 'teste',
//       email: 'teste@test.com',
//       password: 'teste',
//       sex: 'teste',
//       username: 'teste',
//     })

//     const box = await boxesRepositoryInMemory.create({
//       internal: false,
//       name: 'test box',
//       description: 'box description',
//       tags: [{ name: 'test' }],
//       userId: user!.id,
//     })

//     const { box: boxUpdated } = await updateBoxUseCase.execute({
//       boxId: box!.id,
//       description: 'teste superemo',
//       name: 'teste supremo titulo',
//       tags: [{ name: 'test' }, { name: 'test2' }],
//     })

//     expect(boxUpdated?.description).toEqual('teste superemo')
//     expect(boxUpdated?.name).toEqual('teste supremo titulo')
//     expect(boxUpdated.tags.length).toEqual(2)
//     expect(boxUpdated.tags[1].name).toEqual('test2')
//   })

//   it("Should not be able to update box if box don't existes", async () => {
//     expect(async () => {
//       await updateBoxUseCase.execute({
//         boxId: 'inexistent id',
//         description: 'teste superemo',
//       })
//     })
//       .rejects.toBeInstanceOf(AppError)
//       .catch((err) => {
//         throw err
//       })
//   })
// })
