import { inject, injectable } from 'tsyringe'

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import InjectableDependencies from '@shared/container/types'
import { getFeatures } from '@utils/application/dataTransformers/projects/features'

import { type IPreviewProject } from '../types/IPreviewProject'
import {
  type IUserInProject,
  type IProjectPreviewResponse,
} from '../types/IProjectPreviewResponse'

@injectable()
export class ParserProjectsPreview {
  constructor(
    @inject(InjectableDependencies.Providers.DateProvider)
    private readonly dateProvider: IDateProvider,
  ) {}

  parse(projectsPreview: IPreviewProject[]): IProjectPreviewResponse[] {
    const projects: IProjectPreviewResponse[] = projectsPreview.map(
      (project) => {
        const initialDateProject = this.dateProvider.getDateByTimestamp(
          Number(project.initial_date_timestamp),
        )

        console.log(project.initial_date)
        const timeChristInitialDateProject =
          initialDateProject.fullDate.includes('-')
            ? 'Antes de Cristo'
            : 'Depois de Cristo'
        const yearWithoutSimboles = initialDateProject.year.label.replace(
          '-',
          '',
        )

        const featuresInProject = getFeatures(project.features_using)

        const usersInProject: IUserInProject[] = []

        if (project.users_with_access_comment) {
          project.users_with_access_comment.users.map((user) =>
            usersInProject.push({
              id: user.id,
              avatar: {
                alt: user.username,
                url: user.avatar_url ?? undefined,
              },
              permission: 'comment',
            }),
          )
        }

        if (project.users_with_access_edit) {
          project.users_with_access_edit.users.map((user) =>
            usersInProject.push({
              id: user.id,
              avatar: {
                alt: user.username,
                url: user.avatar_url ?? undefined,
              },
              permission: 'edit',
            }),
          )
        }

        if (project.users_with_access_view) {
          project.users_with_access_view.users.map((user) =>
            usersInProject.push({
              id: user.id,
              avatar: {
                alt: user.username,
                url: user.avatar_url ?? undefined,
              },
              permission: 'view',
            }),
          )
        }

        const projectToReturn: IProjectPreviewResponse = {
          id: project.id,
          name: project.name,
          createdAt: project.created_at,
          creator: {
            avatar: {
              alt: 'Criador do projeto',
              url: project.user.avatar_url ?? undefined,
            },
            email: project.user.email,
            id: project.user.id,
            name: project.user.name,
            username: project.user.username,
          },
          image: {
            alt: project.name,
            url: project.image_url ?? undefined,
          },
          initialDate: {
            year: `${yearWithoutSimboles} ${timeChristInitialDateProject}`,
          },
          type: project.type,
          features: featuresInProject,
          users: usersInProject,
          collections: {
            book: {
              itensLength: project._count.books,
            },
            person: {
              itensLength: project._count.persons,
            },
            timeLine: {
              itensLength: project._count.timeLines,
            },
          },
        }

        return projectToReturn
      },
    )

    return projects
  }
}
