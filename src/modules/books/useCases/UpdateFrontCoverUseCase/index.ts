import fs from 'fs'
import { inject, injectable } from 'tsyringe'

import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorFileNotUploaded } from '@shared/errors/useFull/makeErrorFileNotUploaded'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  bookId: string
  file: Express.Multer.File | undefined
}

interface IResponse {
  frontCoveFilename: string
  frontCoverUrl: string
}

@injectable()
export class UpdateFrontCoverBookUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BooksRepository)
    private readonly booksRepository: IBooksRepository,

    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Providers.StorageProvider)
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute({
    bookId,
    file,
    userId,
  }: IRequest): Promise<IResolve<IResponse>> {
    const book = await this.booksRepository.findById(bookId)
    if (!book) {
      return {
        ok: false,
        error: makeErrorBookNotFound(),
      }
    }
    if (!file) {
      return {
        ok: false,
        error: makeErrorFileNotUploaded(),
      }
    }

    const verification = await this.verifyPermissions.verify({
      projectId: book.project_id,
      userId,
      verifyPermissionTo: 'edit',
      verifyFeatureInProject: ['books'],
    })

    if (verification.error) {
      return {
        ok: false,
        error: verification.error,
      }
    }

    const { project, user } = verification.data!

    if (book.front_cover_filename) {
      await this.storageProvider.delete(
        book.front_cover_filename,
        'books/images',
      )
    }

    const url = await this.storageProvider.upload(file, 'books/images')

    await this.booksRepository.update({
      bookId,
      data: { front_cover_filename: file.filename, front_cover_url: url },
    })

    await this.notifyUsersProvider.notifyUsersInOneProject({
      project,
      creatorId: user.id,
      title: `${user.username} alterou a imagem do livro ${book.title} ${
        book.subtitle ? ' - ' + book.subtitle : ''
      }`,
      content: `${user.username} acabou de alterar a imagem do livro:  ${
        book.title
      } ${book.subtitle ? ' - ' + book.subtitle : ''} no projeto ${
        project.name
      }.`,
    })

    fs.rmSync(file.path)

    return {
      ok: true,
      data: {
        frontCoveFilename: file.filename,
        frontCoverUrl: url,
      },
    }
  }
}
