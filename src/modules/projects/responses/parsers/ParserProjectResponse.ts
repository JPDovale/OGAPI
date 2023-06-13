import { type IProject } from '@modules/projects/infra/repositories/entities/IProject'
import { type IProjectType } from '@modules/projects/infra/repositories/entities/IProjectType'
import { type ITimeEventResponse } from '@modules/timelines/responses/types/ITimeEventResponse'
import { type ITimeLineResponse } from '@modules/timelines/responses/types/ITimeLineResponse'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'
import { getFeatures } from '@utils/application/dataTransformers/projects/features'

import { type IUserInProject } from '../types/IProjectPreviewResponse'
import { type IProjectResponse } from '../types/IProjectResponse'

interface IResponse {
  project: IProject
}

interface IResponsePartied {
  project: IProjectResponse
}

type IParserProjectResponse = IResolve<IResponse> | IResolve<IResponsePartied>

export class ParserProjectResponse {
  parser(response: IResolve<IResponse>): IParserProjectResponse {
    if (response.error ?? !response.data?.project) return response

    const project = response.data.project

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
            alt: user.username!,
            url: user.avatar_url ?? undefined,
          },
          permission: 'comment',
          username: user.username ?? '',
          email: user.email ?? '',
        }),
      )
    }

    if (project.users_with_access_edit) {
      project.users_with_access_edit.users.map((user) =>
        usersInProject.push({
          id: user.id,
          avatar: {
            alt: user.username!,
            url: user.avatar_url ?? undefined,
          },
          permission: 'edit',
          username: user.username ?? '',
          email: user.email ?? '',
        }),
      )
    }

    if (project.users_with_access_view) {
      project.users_with_access_view.users.map((user) =>
        usersInProject.push({
          id: user.id,
          avatar: {
            alt: user.username!,
            url: user.avatar_url ?? undefined,
          },
          permission: 'view',
          username: user.username ?? '',
          email: user.email ?? '',
        }),
      )
    }

    const timeLines: ITimeLineResponse[] =
      project.timeLines?.map((timeline) => {
        const timeEvents: ITimeEventResponse[] =
          timeline.timeEvents?.map((event) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            happened: {
              timestamp: Number(event.happened_date_timestamp),
              timeChrist: event.happened_year_time_christ as 'A.C.' | 'D.C.',
              year: event.happened_year,
              month: event.happened_month,
              day: event.happened_day,
              hour: event.happened_hour,
              minute: event.happened_minute,
              second: event.happened_second,
              fullDate: event.happened_date,
            },
            infos: {
              createdAt: event.created_at,
              importance: event.importance,
              updatedAt: event.updated_at,
            },
            collections: {
              person: {
                itens:
                  event.persons?.map((person) => ({ id: person.id ?? '' })) ??
                  [],
                itensLength: event.persons?.length ?? 0,
              },
              scene: event.scene ?? null,
              timeEventBorn: event.timeEventBorn,
              timeEventToDo: event.timeEventToDo,
            },
          })) ?? []

        return {
          id: timeline.id,
          dates:
            timeline.start_date && timeline.end_date
              ? {
                  startDate: timeline.start_date,
                  endDate: timeline.end_date,
                }
              : null,
          description: timeline.description,
          title: timeline.title,
          infos: {
            type: timeline.type,
            isAlternative: timeline.is_alternative,
            createAt: timeline.created_at,
          },
          collections: {
            timeEvent: {
              itensLength: timeline._count?.timeEvents ?? 0,
              itens: timeEvents,
            },
          },
        }
      }) ?? []

    const projectPartied: IProjectResponse = {
      id: project.id,
      name: project.name,
      private: project.private,
      password: project.password,
      type: project.type as IProjectType,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      features: getFeatures(project.features_using),
      users: usersInProject,
      creator: {
        avatar: {
          alt: project.user!.username,
          url: project.user!.avatar_url ?? undefined,
        },
        email: project.user!.email,
        id: project.user!.id,
        name: project.user!.name,
        username: project.user!.username,
      },
      initialDate: {
        fullDate: project.initial_date,
        timeChrist: project.initial_date_time_christ as 'A.C.' | 'D.C.',
        timestamp: Number(project.initial_date_timestamp),
        year: projectInitialYear,
      },
      image: {
        alt: project.name,
        url: project.image_url ?? undefined,
      },
      plot: {
        ambient: project.ambient,
        countTime: project.count_time,
        historicalFact: project.historical_fact,
        details: project.details,
        literaryGenre: project.literary_genre,
        onePhrase: project.one_phrase,
        premise: project.premise,
        storyteller: project.storyteller,
        subgenre: project.subgenre,
        summary: project.summary,
        urlText: project.url_text,
        structure: {
          act1: project.structure_act_1,
          act2: project.structure_act_2,
          act3: project.structure_act_3,
        },
      },
      collections: {
        comments: {
          itensLength: project.comments?.length ?? 0,
          itens: project.comments ?? [],
        },
        book: {
          itensLength: project._count?.books ?? 0,
          itens:
            project.books?.map((book) => ({
              id: book.id,
              name: {
                title: book.title,
                subtitle: book.subtitle ?? undefined,
                fullName: `${book.title} ${book.subtitle ? book.subtitle : ''}`,
              },
              frontCover: {
                alt: `${book.title} ${book.subtitle}`,
                url: book.front_cover_url ?? undefined,
              },
              infos: {
                createdAt: book.created_at,
                updatedAt: book.updated_at,
                isbn: book.isbn ? book.isbn : 'Você ainda não definiu seu isnb',
                literaryGenre: book.literary_genre,
                words: book.words,
                writtenWords: book.written_words,
              },
              collections: {
                author: {
                  itensLength: book._count?.authors ?? 0,
                },
                capitules: {
                  itensLength: book._count?.capitules ?? 0,
                },
                comments: {
                  itensLength: book._count?.comments ?? 0,
                },
                genre: {
                  itensLength: book._count?.genres ?? 0,
                },
              },
            })) ?? [],
        },
        person: {
          itensLength: project._count?.persons ?? 0,
          itens:
            project.persons?.map((person) => ({
              id: person.id,
              name: {
                first: person.name,
                last: person.last_name,
                full: `${person.name} ${person.last_name}`,
              },
              image: {
                alt: `${person.name} ${person.last_name}`,
                url: person.image_url ?? undefined,
              },
              age: {
                number: person.age,
                bornDate: person.born_date,
                bornDateTimestamp: Number(person.born_date_timestamp),
              },
              history: person.history,
              infos: {
                createdAt: person.created_at,
                updatedAt: person.updated_at,
              },
              collections: {
                appearance: {
                  itensLength: person._count?.appearances ?? 0,
                },
                couple: {
                  itensLength: person._count?.couples ?? 0,
                },
                dream: {
                  itensLength: person._count?.dreams ?? 0,
                },
                fear: {
                  itensLength: person._count?.fears ?? 0,
                },
                objective: {
                  itensLength: person._count?.objectives ?? 0,
                },
                personality: {
                  itensLength: person._count?.personalities ?? 0,
                },
                power: {
                  itensLength: person._count?.powers ?? 0,
                },
                trauma: {
                  itensLength: person._count?.traumas ?? 0,
                },
                value: {
                  itensLength: person._count?.values ?? 0,
                },
                wishe: {
                  itensLength: person._count?.wishes ?? 0,
                },
              },
            })) ?? [],
        },
        timeLine: {
          itensLength: project._count?.timeLines ?? 0,
          itens: timeLines,
        },
      },
    }

    return {
      ok: response.ok,
      data: {
        project: projectPartied,
      },
    }
  }
}
