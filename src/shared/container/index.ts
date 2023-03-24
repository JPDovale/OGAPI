import 'reflect-metadata'
import { container } from 'tsyringe'

import '@shared/container/providers'
import '@shared/container/services'

import { RefreshTokenRepository } from '@modules/accounts/infra/mongoose/repositories/implementations/RefreshTokenRepository'
import { UsersMongoRepository } from '@modules/accounts/infra/mongoose/repositories/implementations/UsersMongoRepository'
import { type IRefreshTokenRepository } from '@modules/accounts/infra/mongoose/repositories/IRefreshTokenRepository'
import { type IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { type IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { BooksMongoRepository } from '@modules/books/infra/mongoose/repositories/implementations/BooksMongoRepository'
import { type IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { BoxesMongoRepository } from '@modules/boxes/infra/mongoose/repositories/implementations/BoxesMongoRepository'
import { PersonsMongoRepository } from '@modules/persons/infra/mongoose/repositories/PersonsMongoRepository'
import { type IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { ProjectsMongoRepository } from '@modules/projects/infra/mongoose/repositories/ProjectsMongoRepository'
import { type IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'

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

container.registerSingleton<IBoxesRepository>(
  'BoxesRepository',
  BoxesMongoRepository,
)
