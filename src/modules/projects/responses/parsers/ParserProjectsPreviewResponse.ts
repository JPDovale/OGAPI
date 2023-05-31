import { type IProjectType } from '@modules/projects/infra/repositories/entities/IProjectType'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'
import { getFeatures } from '@utils/application/dataTransformers/projects/features'

import { type IPreviewProject } from '../types/IPreviewProject'
import {
  type IUserInProject,
  type IProjectPreviewResponse,
} from '../types/IProjectPreviewResponse'

interface IResponse {
  projects: IPreviewProject[]
}

interface IResponsePartied {
  projects: IProjectPreviewResponse[]
}

type IParserPreviewProjectsResponse =
  | IResolve<IResponse>
  | IResolve<IResponsePartied>

export class ParserProjectsPreviewResponse {
  parser(response: IResolve<IResponse>): IParserPreviewProjectsResponse {
    if (response.error ?? !response.data?.projects[0]) return response

    const projects = response.data.projects

    const projectsPartied = projects.map((project) => this.perseOne(project))

    return {
      ok: response.ok,
      data: {
        projects: projectsPartied,
      },
    }
  }

  perseOne(project: IPreviewProject): IProjectPreviewResponse {
    const projectYear =
      project.initial_date !== 'non-set'
        ? project.initial_date.split('/')[2].split(' ')[0]
        : 'Não definido'
    const projectInitialYear =
      projectYear === 'Não definido'
        ? projectYear
        : `${projectYear.replace('-', '')} ${
            projectYear.includes('-') ? 'Antes de Cristo' : 'Depois de Cristo'
          }`

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
          email: '',
          username: user.username,
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
          email: '',
          username: user.username,
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
          email: '',
          username: user.username,
        }),
      )
    }

    return {
      id: project.id,
      name: project.name,
      createdAt: project.created_at,
      creator: {
        avatar: {
          alt: project.user.username,
          url: project.user.avatar_url ?? undefined,
        },
        email: project.user.email,
        id: project.user.id,
        name: project.user.name,
        username: project.user.username,
      },
      features: getFeatures(project.features_using),
      image: {
        alt: project.name,
        url: project.image_url ?? undefined,
      },
      initialDate: {
        year: projectInitialYear,
      },
      type: project.type as IProjectType,
      users: usersInProject,
      collections: {
        book: {
          itensLength: project._count.books ?? 0,
        },
        person: {
          itensLength: project._count.persons ?? 0,
        },
        timeLine: {
          itensLength: project._count.timeLines ?? 0,
        },
      },
    }
  }
}
