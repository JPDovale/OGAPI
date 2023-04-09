import 'reflect-metadata'
import { container } from 'tsyringe'

import '@shared/container/providers'
import '@shared/container/services'

import { UsersMongoRepository } from '@modules/accounts/infra/mongoose/repositories/implementations/UsersMongoRepository'
import { NotificationsPrismaRepository } from '@modules/accounts/infra/prisma/repositories/NotificationsPrismaRepository'
import { RefreshTokensPrismaRepository } from '@modules/accounts/infra/prisma/repositories/RefreshTokensPrismaRepository'
import { UsersPrismaRepository } from '@modules/accounts/infra/prisma/repositories/UsersPrismaRepository'
import { type INotificationsRepository } from '@modules/accounts/infra/repositories/contracts/INotificationRepository'
import { type IRefreshTokenRepository } from '@modules/accounts/infra/repositories/contracts/IRefreshTokenRepository'
import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { BooksMongoRepository } from '@modules/books/infra/mongoose/repositories/implementations/BooksMongoRepository'
import { type IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { type IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { BoxesMongoRepository } from '@modules/boxes/infra/mongoose/repositories/implementations/BoxesMongoRepository'
import { PersonsMongoRepository } from '@modules/persons/infra/mongoose/repositories/PersonsMongoRepository'
import { PersonsPrismaRepository } from '@modules/persons/infra/prisma/repositories/PersonsPrismaRepository'
import { type IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { ProjectsMongoRepository } from '@modules/projects/infra/mongoose/repositories/ProjectsMongoRepository'
import { CommentsPrismaRepository } from '@modules/projects/infra/prisma/repositories/CommentsPrismaRepository'
import { ProjectsPrismaRepository } from '@modules/projects/infra/prisma/repositories/ProjectsPrismaRepository'
import { type ICommentsRepository } from '@modules/projects/infra/repositories/contracts/ICommentsRepository'
import { type IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'

import { Repositories } from './types/Repositories'

container.registerSingleton<IUsersRepository>(
  Repositories.UsersRepository,
  UsersPrismaRepository,
)
container.registerSingleton<IRefreshTokenRepository>(
  Repositories.RefreshTokenRepository,
  RefreshTokensPrismaRepository,
)
container.registerSingleton<INotificationsRepository>(
  Repositories.NotificationsRepository,
  NotificationsPrismaRepository,
)

container.registerSingleton<IProjectsRepository>(
  Repositories.ProjectsRepository,
  ProjectsPrismaRepository,
)
container.registerSingleton<ICommentsRepository>(
  Repositories.CommentsRepository,
  CommentsPrismaRepository,
)

container.registerSingleton<IPersonsRepository>(
  Repositories.PersonsRepository,
  PersonsPrismaRepository,
)

// TEMPORARY
// =================================================================================================
container.registerSingleton<IUsersRepository>(
  Repositories.UserMongoRepository,
  UsersMongoRepository,
)

container.registerSingleton<IProjectsRepository>(
  Repositories.ProjectMongoRepository,
  ProjectsMongoRepository,
)
container.registerSingleton<IPersonsRepository>(
  Repositories.PersonMongoRepository,
  PersonsMongoRepository,
)
// =================================================================================================
// TEMPORARY

container.registerSingleton<IBooksRepository>(
  'BooksRepository',
  BooksMongoRepository,
)

container.registerSingleton<IBoxesRepository>(
  'BoxesRepository',
  BoxesMongoRepository,
)
