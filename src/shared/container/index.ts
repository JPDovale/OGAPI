import 'reflect-metadata'
import { container } from 'tsyringe'

import '@shared/container/provides'
import '@shared/container/services'

import { RefreshTokenRepository } from '@modules/accounts/infra/mongoose/repositories/implementations/RefreshTokenRepository'
import { UsersMongoRepository } from '@modules/accounts/infra/mongoose/repositories/implementations/UsersMongoRepository'
import { IRefreshTokenRepository } from '@modules/accounts/infra/mongoose/repositories/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { BooksMongoRepository } from '@modules/books/infra/mongoose/repositories/implementations/BooksMongoRepository'
import { PersonsMongoRepository } from '@modules/persons/infra/mongoose/repositories/PersonsMongoRepository'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { ProjectsMongoRepository } from '@modules/projects/infra/mongoose/repositories/ProjectsMongoRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersMongoRepository,
)

container.registerSingleton<IProjectsRepository>(
  'ProjectsRepository',
  ProjectsMongoRepository,
)

container.registerSingleton<IRefreshTokenRepository>(
  'RefreshTokenRepository',
  RefreshTokenRepository,
)

container.registerSingleton<IPersonsRepository>(
  'PersonsRepository',
  PersonsMongoRepository,
)

container.registerSingleton<IBooksRepository>(
  'BooksRepository',
  BooksMongoRepository,
)
