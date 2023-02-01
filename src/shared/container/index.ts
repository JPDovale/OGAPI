import 'reflect-metadata'
import { container } from 'tsyringe'

import '@shared/container/provides'

import { RefreshTokenRepository } from '@modules/accounts/infra/mongoose/repositories/RefreshTokenRepository'
import { UsersMongoRepository } from '@modules/accounts/infra/mongoose/repositories/UsersMongoRepository'
import { IRefreshTokenRepository } from '@modules/accounts/repositories/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IBooksRepository } from '@modules/books/infra/repositories/IBooksRepository'
import { BooksMongoRepository } from '@modules/books/infra/repositories/implementations/BooksMongoRepository'
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
