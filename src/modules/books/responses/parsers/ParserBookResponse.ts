import { type IBook } from '@modules/books/infra/repositories/entities/IBook'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

import { type IBookResponse } from '../types/IBookResponse'

interface IResponse {
  book: IBook
}

interface IResponsePartied {
  book: IBookResponse
}

type IParserBookResponse = IResolve<IResponse> | IResolve<IResponsePartied>

export class ParserBookResponse {
  parser(response: IResolve<IResponse>): IParserBookResponse {
    if (response.error ?? !response.data?.book) return response

    const book = response.data.book

    const bookPartied: IBookResponse = {
      id: book.id,
      name: {
        title: book.title,
        subtitle: book.subtitle ?? null,
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
        projectId: book.project_id,
      },
      plot: {
        ambient: book.ambient,
        countTime: book.count_time,
        details: book.details,
        premise: book.premise,
        storyteller: book.storyteller,
        summary: book.summary,
        historicalFact: book.historical_fact,
        onePhrase: book.one_phrase,
        urlText: book.url_text,
        structure: {
          act1: book.structure_act_1,
          act2: book.structure_act_2,
          act3: book.structure_act_3,
        },
      },
      collections: {
        author: {
          itensLength: book.authors?.length ?? 0,
          itens:
            book.authors?.map((author) => ({
              user: {
                avatar: {
                  alt: author.user!.username,
                  url: author.user!.avatar_url ?? undefined,
                },
                username: author.user!.username,
                email: author.user!.email,
                id: author.user!.id,
              },
              id: author.id,
            })) ?? [],
        },
        capitules: {
          itensLength: book.capitules?.length ?? 0,
          itens:
            book.capitules?.map((capitule) => ({
              id: capitule.id,
              name: capitule.name,
              infos: {
                complete: capitule.complete,
                objective: capitule.objective,
                sequence: capitule.sequence,
                words: capitule.words,
              },
              structure: {
                act1: capitule.structure_act_1,
                act2: capitule.structure_act_2,
                act3: capitule.structure_act_3,
              },
              collections: {
                scene: {
                  itensLength: capitule._count?.scenes ?? 0,
                },
              },
            })) ?? [],
        },
        comments: {
          itensLength: book.comments?.length ?? 0,
          itens: book.comments ?? [],
        },
        genre: {
          itensLength: book.genres?.length ?? 0,
          itens:
            book.genres?.map((genre) => ({
              id: genre.id,
              name: genre.name,
            })) ?? [],
        },
      },
    }

    return {
      ok: response.ok,
      data: {
        book: bookPartied,
      },
    }
  }
}
