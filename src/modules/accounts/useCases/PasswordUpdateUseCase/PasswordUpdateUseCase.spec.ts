import 'reflect-metadata'

import { hashSync } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { UserRepositoryInMemory } from '@modules/accounts/infra/repositories/inMemory/UserRepositoryInMemory'
import { AppError } from '@shared/errors/AppError'

import { PasswordUpdateUseCase } from '.'

let userRepositoryImMemory: IUsersRepository

let passwordUpdateUseCase: PasswordUpdateUseCase

describe('Update Password', () => {
  beforeEach(() => {
    userRepositoryImMemory = new UserRepositoryInMemory()

    passwordUpdateUseCase = new PasswordUpdateUseCase(userRepositoryImMemory)
  })

  it('Should be able update password', async () => {
    const newUser = await userRepositoryImMemory.create({
      age: '18',
      email: 'test@test',
      name: 'Jonas',
      password: hashSync('password', 8),
      sex: 'uncharacterized',
      username: 'j',
    })

    if (!newUser) throw new Error()

    await passwordUpdateUseCase.execute({
      id: newUser.id,
      oldPassword: 'password',
      password: 'password2',
    })

    const updatedUser = await userRepositoryImMemory.findById(newUser.id)
    if (!updatedUser) throw new Error()

    expect(newUser.password).not.toEqual(updatedUser.password)
  })

  it('Not should be able update password with wrong old password', async () => {
    expect(async () => {
      const newUser = await userRepositoryImMemory.create({
        age: '18',
        email: 'test@test',
        name: 'Jonas',
        password: hashSync('password', 8),
        sex: 'uncharacterized',
        username: 'j',
      })

      if (!newUser) throw new Error()

      await passwordUpdateUseCase.execute({
        id: newUser.id,
        oldPassword: 'password2',
        password: 'password3',
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })

  it('Not should be able update password for not existe user', async () => {
    expect(async () => {
      await passwordUpdateUseCase.execute({
        id: '1231231',
        oldPassword: 'password2',
        password: 'password3',
      })
    })
      .rejects.toBeInstanceOf(AppError)
      .catch((err) => {
        throw err
      })
  })
})
