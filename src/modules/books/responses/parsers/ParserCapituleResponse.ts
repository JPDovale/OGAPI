import { type ICapitule } from '@modules/books/infra/repositories/entities/ICapitule'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

import { type ICapituleResponse } from '../types/ICapituleResponse'

interface IResponse {
  capitule: ICapitule
}

interface IResponsePartied {
  capitule: ICapituleResponse
}

type IParserCapituleResponse = IResolve<IResponse> | IResolve<IResponsePartied>

export class ParserCapituleResponse {
  parser(response: IResolve<IResponse>): IParserCapituleResponse {
    if (response.error ?? !response.data?.capitule) return response

    const capitule = response.data.capitule

    const capitulePartied: ICapituleResponse = {
      id: capitule.id,
      name: capitule.name,
      infos: {
        complete: capitule.complete,
        objective: capitule.objective,
        sequence: capitule.sequence,
        words: capitule.words,
        projectId: capitule.book!.project_id,
        bookId: capitule.book_id,
      },
      structure: {
        act1: capitule.structure_act_1,
        act2: capitule.structure_act_2,
        act3: capitule.structure_act_3,
      },
      collections: {
        scene: {
          itensLength: capitule._count?.scenes ?? 0,
          itens:
            capitule.scenes?.map((scene) => ({
              id: scene.id,
              infos: {
                complete: scene.complete,
                sequence: scene.sequence,
                writtenWords: scene.written_words,
                objective: scene.objective,
              },
              happened: {
                day: scene.happened_day,
                fullDate: scene.happened_date,
                hour: scene.happened_hour,
                minute: scene.happened_minute,
                second: scene.happened_second,
                month: scene.happened_month,
                timeChrist: scene.happened_year_time_christ as 'A.C.' | 'D.C.',
                timestamp: Number(scene.happened_date_timestamp),
                year: scene.happened_year,
              },
              structure: {
                act1: scene.structure_act_1,
                act2: scene.structure_act_2,
                act3: scene.structure_act_3,
              },
              collections: {
                persons: {
                  itensLength: scene.persons?.length ?? 0,
                  itens:
                    scene.persons?.map((person) => ({
                      id: person.id,
                      name: person.name,
                      image: {
                        url: person.image_url ?? undefined,
                        alt: person.name,
                      },
                    })) ?? [],
                },
              },
            })) ?? [],
        },
      },
    }

    return {
      ok: response.ok,
      data: {
        capitule: capitulePartied,
      },
    }
  }
}
