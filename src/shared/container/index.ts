import 'reflect-metadata'
import { container } from 'tsyringe'

import '@shared/container/providers'
import '@shared/container/services'

import { NotificationsPrismaRepository } from '@modules/accounts/infra/prisma/repositories/NotificationsPrismaRepository'
import { RefreshTokensPrismaRepository } from '@modules/accounts/infra/prisma/repositories/RefreshTokensPrismaRepository'
import { UsersPrismaRepository } from '@modules/accounts/infra/prisma/repositories/UsersPrismaRepository'
import { type INotificationsRepository } from '@modules/accounts/infra/repositories/contracts/INotificationRepository'
import { type IRefreshTokenRepository } from '@modules/accounts/infra/repositories/contracts/IRefreshTokenRepository'
import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { BooksPrismaRepository } from '@modules/books/infra/prisma/repositories/BooksPrismaRepository'
import { CapitulesPrismaRepository } from '@modules/books/infra/prisma/repositories/CapitulesPrismaRepository'
import { ScenesPrismaRepository } from '@modules/books/infra/prisma/repositories/ScenesPrismaRepository'
import { type IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { type ICapitulesRepository } from '@modules/books/infra/repositories/contracts/ICapitulesRepository'
import { type IScenesRepository } from '@modules/books/infra/repositories/contracts/IScenesRepository'
import { ArchivesPrismaRepository } from '@modules/boxes/infra/prisma/repositories/ArchivesPrismaRepository'
import { BoxesPrismaRepository } from '@modules/boxes/infra/prisma/repositories/BoxesPrismaRepository'
import { ImagesPrismaRepository } from '@modules/boxes/infra/prisma/repositories/ImagesPrismaRepository'
import { type IArchivesRepository } from '@modules/boxes/infra/repositories/contracts/IArchivesRepository'
import { type IBoxesRepository } from '@modules/boxes/infra/repositories/contracts/IBoxesRepository'
import { type IImagesRepository } from '@modules/boxes/infra/repositories/contracts/IImagesRepository'
import { AppearancesPrismaRepository } from '@modules/persons/infra/prisma/repositories/AppearancesPrismaRepository'
import { CouplesPrismaRepository } from '@modules/persons/infra/prisma/repositories/CouplesPrismaRepository'
import { DreamsPrismaRepository } from '@modules/persons/infra/prisma/repositories/DreamsPrismaRepository'
import { FearsPrismaRepository } from '@modules/persons/infra/prisma/repositories/FearsPrismaRepository'
import { ObjectivesPrismaRepository } from '@modules/persons/infra/prisma/repositories/ObjectivesPrismaRepository'
import { PersonalitiesPrismaRepository } from '@modules/persons/infra/prisma/repositories/PersonalitiesPrismaRepository'
import { PersonsPrismaRepository } from '@modules/persons/infra/prisma/repositories/PersonsPrismaRepository'
import { PowersPrismaRepository } from '@modules/persons/infra/prisma/repositories/PowersPrismaRepository'
import { TraumasPrismaRepository } from '@modules/persons/infra/prisma/repositories/TraumasPrismaRepository'
import { ValuesPrismaRepository } from '@modules/persons/infra/prisma/repositories/ValuesPrismaRepository'
import { WishesPrismaRepository } from '@modules/persons/infra/prisma/repositories/WishesPrismaRepository'
import { type IAppearancesRepository } from '@modules/persons/infra/repositories/contracts/IAppearancesRepository'
import { type ICouplesRepository } from '@modules/persons/infra/repositories/contracts/ICouplesRepository'
import { type IDreamsRepository } from '@modules/persons/infra/repositories/contracts/IDreamsRepository'
import { type IFearsRepository } from '@modules/persons/infra/repositories/contracts/IFearsRepository'
import { type IObjectivesRepository } from '@modules/persons/infra/repositories/contracts/IObjectivesRepository'
import { type IPersonalitiesRepository } from '@modules/persons/infra/repositories/contracts/IPersonalitiesRepository'
import { type IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IPowersRepository } from '@modules/persons/infra/repositories/contracts/IPowersRepository'
import { type ITraumasRepository } from '@modules/persons/infra/repositories/contracts/ITraumasRepository'
import { type IValuesRepository } from '@modules/persons/infra/repositories/contracts/IValuesRepository'
import { type IWishesRepository } from '@modules/persons/infra/repositories/contracts/IWishesRepository'
import { SubscriptionsPrismaRepository } from '@modules/products/infra/prisma/repositories/SubscriptionsPrismaRepository'
import { type ISubscriptionsRepository } from '@modules/products/infra/repositories/contracts/ISubscriptionsRepository'
import { CommentsPrismaRepository } from '@modules/projects/infra/prisma/repositories/CommentsPrismaRepository'
import { ProjectsPrismaRepository } from '@modules/projects/infra/prisma/repositories/ProjectsPrismaRepository'
import { type ICommentsRepository } from '@modules/projects/infra/repositories/contracts/ICommentsRepository'
import { type IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { TimeEventsPrismaRepository } from '@modules/timelines/infra/prisma/repositories/TimeEventsPrismaRepository'
import { TimeLinesPrismaRepository } from '@modules/timelines/infra/prisma/repositories/TimeLinesPrismaRepository'
import { type ITimeEventsRepository } from '@modules/timelines/infra/repositories/contracts/ITimeEventsRepository'
import { type ITimeLinesRepository } from '@modules/timelines/infra/repositories/contracts/ITimeLinesRepository'

import { Repositories } from './types/Repositories'

// =========================================================================
// ++++++++++++++++++++++++++++++USERS++++++++++++++++++++++++++++++++++++++
// =========================================================================
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

// =========================================================================
// ++++++++++++++++++++++++++++++PROJECTS+++++++++++++++++++++++++++++++++++
// =========================================================================
container.registerSingleton<IProjectsRepository>(
  Repositories.ProjectsRepository,
  ProjectsPrismaRepository,
)
container.registerSingleton<ICommentsRepository>(
  Repositories.CommentsRepository,
  CommentsPrismaRepository,
)

// =========================================================================
// +++++++++++++++++++++++++++++++PERSONS+++++++++++++++++++++++++++++++++++
// =========================================================================
container.registerSingleton<IPersonsRepository>(
  Repositories.PersonsRepository,
  PersonsPrismaRepository,
)
container.registerSingleton<IAppearancesRepository>(
  Repositories.AppearancesRepository,
  AppearancesPrismaRepository,
)
container.registerSingleton<ICouplesRepository>(
  Repositories.CouplesRepository,
  CouplesPrismaRepository,
)
container.registerSingleton<IDreamsRepository>(
  Repositories.DreamsRepository,
  DreamsPrismaRepository,
)
container.registerSingleton<IFearsRepository>(
  Repositories.FearsRepository,
  FearsPrismaRepository,
)
container.registerSingleton<IObjectivesRepository>(
  Repositories.ObjectivesRepository,
  ObjectivesPrismaRepository,
)
container.registerSingleton<IPersonalitiesRepository>(
  Repositories.PersonalitiesRepository,
  PersonalitiesPrismaRepository,
)
container.registerSingleton<IPowersRepository>(
  Repositories.PowersRepository,
  PowersPrismaRepository,
)
container.registerSingleton<ITraumasRepository>(
  Repositories.TraumasRepository,
  TraumasPrismaRepository,
)
container.registerSingleton<IValuesRepository>(
  Repositories.ValuesRepository,
  ValuesPrismaRepository,
)
container.registerSingleton<IWishesRepository>(
  Repositories.WishesRepository,
  WishesPrismaRepository,
)

// =========================================================================
// ++++++++++++++++++++++++++++++++BOOKS++++++++++++++++++++++++++++++++++++
// =========================================================================
container.registerSingleton<IBooksRepository>(
  Repositories.BooksRepository,
  BooksPrismaRepository,
)
container.registerSingleton<ICapitulesRepository>(
  Repositories.CapitulesRepository,
  CapitulesPrismaRepository,
)
container.registerSingleton<IScenesRepository>(
  Repositories.ScenesRepository,
  ScenesPrismaRepository,
)

// =========================================================================
// ++++++++++++++++++++++++++++++++BOXES++++++++++++++++++++++++++++++++++++
// =========================================================================
container.registerSingleton<IBoxesRepository>(
  Repositories.BoxesRepository,
  BoxesPrismaRepository,
)
container.registerSingleton<IArchivesRepository>(
  Repositories.ArchivesRepository,
  ArchivesPrismaRepository,
)
container.registerSingleton<IImagesRepository>(
  Repositories.ImagesRepository,
  ImagesPrismaRepository,
)

// =========================================================================
// ++++++++++++++++++++++++++++SUBSCRIPTIONS++++++++++++++++++++++++++++++++
// =========================================================================
container.registerSingleton<ISubscriptionsRepository>(
  Repositories.SubscriptionsRepository,
  SubscriptionsPrismaRepository,
)

// =========================================================================
// ++++++++++++++++++++++++++++++TIME-LINES+++++++++++++++++++++++++++++++++
// =========================================================================
container.registerSingleton<ITimeLinesRepository>(
  Repositories.TimeLinesRepository,
  TimeLinesPrismaRepository,
)

container.registerSingleton<ITimeEventsRepository>(
  Repositories.TimeEventsRepository,
  TimeEventsPrismaRepository,
)
