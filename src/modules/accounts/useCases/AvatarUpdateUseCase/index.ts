import fs from 'fs'
import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorFileNotUploaded } from '@shared/errors/useFull/makeErrorFileNotUploaded'
import { makeInternalError } from '@shared/errors/useFull/makeInternalError'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { makeErrorUserNotUpdate } from '@shared/errors/users/makeErrorUserNotUpdate'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  file: Express.Multer.File | undefined
  userId: string
}

interface IResponse {
  user: IUser
}

@injectable()
export class AvatarUpdateUseCase {
  constructor(
    @inject(InjectableDependencies.Providers.StorageProvider)
    private readonly storageProvider: IStorageProvider,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({ file, userId }: IRequest): Promise<IResolve<IResponse>> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw makeErrorUserNotFound()
    if (!file) {
      return {
        ok: false,
        error: makeErrorFileNotUploaded(),
      }
    }

    if (user.avatar_filename) {
      try {
        await this.storageProvider.delete(user.avatar_filename, 'avatar')
      } catch (err) {
        console.log(err)
        return {
          ok: false,
          error: makeInternalError(),
        }
      }
    }

    const url = await this.storageProvider.upload(file, 'avatar')
    const updatedUser = await this.usersRepository.updateUser({
      userId,
      data: {
        avatar_filename: file.filename,
        avatar_url: url,
      },
    })

    if (!updatedUser) {
      return {
        ok: false,
        error: makeErrorUserNotUpdate(),
      }
    }

    fs.rmSync(file.path)

    return {
      ok: true,
      data: {
        user: updatedUser,
      },
    }
  }
}
