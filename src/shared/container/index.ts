import 'reflect-metadata'
import { container } from 'tsyringe'

import '@shared/container/provides'

import { RefreshTokenRepository } from '@modules/accounts/infra/mongoose/repositories/RefreshTokenRepository'
import { UsersMongoRepository } from '@modules/accounts/infra/mongoose/repositories/UsersMongoRepository'
import { IRefreshTokenRepository } from '@modules/accounts/repositories/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
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
