import { type IAppearance } from '@modules/persons/infra/repositories/entities/IAppearance'
import { type ICouple } from '@modules/persons/infra/repositories/entities/ICouple'
import { type IDream } from '@modules/persons/infra/repositories/entities/IDream'
import { type IFear } from '@modules/persons/infra/repositories/entities/IFear'
import { type IObjective } from '@modules/persons/infra/repositories/entities/IObjective'
import { type IPerson } from '@modules/persons/infra/repositories/entities/IPerson'
import { type IPersonality } from '@modules/persons/infra/repositories/entities/IPersonality'
import { type IPower } from '@modules/persons/infra/repositories/entities/IPower'
import { type ITrauma } from '@modules/persons/infra/repositories/entities/ITrauma'
import { type IValue } from '@modules/persons/infra/repositories/entities/IValue'
import { type IWishe } from '@modules/persons/infra/repositories/entities/IWishe'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

import { type IAppearanceResponse } from '../types/IAppearanceResponse'
import { type ICoupleResponse } from '../types/ICoupleResponse'
import { type IDreamResponse } from '../types/IDreamResponse'
import { type IFearResponse } from '../types/IFearResponse'
import { type IObjectiveResponse } from '../types/IObjectiveResponse'
import { type IPersonalityResponse } from '../types/IPersonalityResponse'
import { type IPersonResponse } from '../types/IPersonResponse'
import { type IPowerResponse } from '../types/IPowerResponse'
import { type ITraumaResponse } from '../types/ITraumaResponse'
import { type IValueResponse } from '../types/IValueResponse'
import { type IWisheResponse } from '../types/IWisheResponse'

interface IResponse {
  person: IPerson
}

interface IResponsePartied {
  person: IPersonResponse
}

type IParserPersonResponse = IResolve<IResponse> | IResolve<IResponsePartied>

export class ParserPersonResponse {
  parser(response: IResolve<IResponse>): IParserPersonResponse {
    if (response.error ?? !response.data?.person) return response

    const person = response.data.person

    const personPartied: IPersonResponse = {
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
        bornDateDay: person.born_day,
        bornDateHour: person.born_hour,
        bornDateMinute: person.born_minute,
        bornDateMonth: person.born_month,
        bornDateSecond: person.born_second,
        bornDateYear: person.born_year,
        bornTimeChrist: person.born_year_time_christ as 'A.C.' | 'D.C.',
      },
      history: person.history,
      infos: {
        createdAt: person.created_at,
        updatedAt: person.updated_at,
        projectId: person.project_id,
      },
      collections: {
        appearance: {
          itensLength: person?.appearances?.length ?? 0,
          itens: this.parserAppearances(person.appearances ?? []),
        },
        couple: {
          itensLength: person?.couples?.length ?? 0,
          itens: this.parserCouples(person.couples ?? []),
        },
        dream: {
          itensLength: person?.dreams?.length ?? 0,
          itens: this.parserDreams(person.dreams ?? []),
        },
        fear: {
          itensLength: person?.fears?.length ?? 0,
          itens: this.parserFears(person.fears ?? []),
        },
        objective: {
          itensLength: person?.objectives?.length ?? 0,
          itens: this.parserObjectives(person.objectives ?? []),
        },
        personality: {
          itensLength: person?.personalities?.length ?? 0,
          itens: this.parserPersonalities(person.personalities ?? []),
        },
        power: {
          itensLength: person?.powers?.length ?? 0,
          itens: this.parserPowers(person.powers ?? []),
        },
        trauma: {
          itensLength: person?.traumas?.length ?? 0,
          itens: this.parserTraumas(person.traumas ?? []),
        },
        value: {
          itensLength: person?.values?.length ?? 0,
          itens: this.parserValues(person.values ?? []),
        },
        wishe: {
          itensLength: person?.wishes?.length ?? 0,
          itens: this.parserWishes(person.wishes ?? []),
        },
      },
    }

    return {
      ok: response.ok,
      data: {
        person: personPartied,
      },
    }
  }

  parserWishes(wishes: IWishe[]): IWisheResponse[] {
    return wishes.map((wishe) => ({
      id: wishe.id,
      infos: {
        title: wishe.title,
        description: wishe.description,
        createdAt: wishe.created_at,
      },
      collections: {
        referencesIt: {
          itensLength: wishe?.persons?.length ?? 0,
          itens:
            wishe?.persons?.map((ref) => ({
              id: ref.id,
              name: { first: ref.name },
              image: {
                url: ref.image_url ?? undefined,
                alt: ref.name,
              },
            })) ?? [],
        },
        comment: {
          itensLength: wishe?.comments?.length ?? 0,
          itens: wishe.comments ?? [],
        },
      },
    }))
  }

  parserValues(values: IValue[]): IValueResponse[] {
    return values.map((value) => ({
      id: value.id,
      infos: {
        title: value.title,
        description: value.description,
        createdAt: value.created_at,
      },
      collections: {
        referencesIt: {
          itensLength: value?.persons?.length ?? 0,
          itens:
            value?.persons?.map((ref) => ({
              id: ref.id,
              name: { first: ref.name },
              image: {
                url: ref.image_url ?? undefined,
                alt: ref.name,
              },
            })) ?? [],
        },
        exception: {
          itensLength: value?.exceptions?.length ?? 0,
          itens:
            value.exceptions?.map((exception) => ({
              id: exception.id,
              infos: {
                title: exception.title,
                description: exception.description,
                createdAt: exception.created_at,
              },
              collections: {
                value: value.id,
              },
            })) ?? [],
        },
        comment: {
          itensLength: value?.comments?.length ?? 0,
          itens: value.comments ?? [],
        },
      },
    }))
  }

  parserTraumas(traumas: ITrauma[]): ITraumaResponse[] {
    return traumas.map((trauma) => ({
      id: trauma.id,
      infos: {
        title: trauma.title,
        description: trauma.description,
        createdAt: trauma.created_at,
      },
      collections: {
        referencesIt: {
          itensLength: trauma?.persons?.length ?? 0,
          itens:
            trauma?.persons?.map((ref) => ({
              id: ref.id,
              name: { first: ref.name },
              image: {
                url: ref.image_url ?? undefined,
                alt: ref.name,
              },
            })) ?? [],
        },
        consequence: {
          itensLength: trauma?.consequences?.length ?? 0,
          itens:
            trauma.consequences?.map((consequence) => ({
              id: consequence.id,
              infos: {
                title: consequence.title,
                description: consequence.description,
                createdAt: consequence.created_at,
              },
              collections: {
                trauma: trauma.id,
              },
            })) ?? [],
        },
        comment: {
          itensLength: trauma?.comments?.length ?? 0,
          itens: trauma.comments ?? [],
        },
      },
    }))
  }

  parserPowers(powers: IPower[]): IPowerResponse[] {
    return powers.map((power) => ({
      id: power.id,
      infos: {
        title: power.title,
        description: power.description,
        createdAt: power.created_at,
      },
      collections: {
        referencesIt: {
          itensLength: power?.persons?.length ?? 0,
          itens:
            power?.persons?.map((ref) => ({
              id: ref.id,
              name: { first: ref.name },
              image: {
                url: ref.image_url ?? undefined,
                alt: ref.name,
              },
            })) ?? [],
        },
        comment: {
          itensLength: power?.comments?.length ?? 0,
          itens: power.comments ?? [],
        },
      },
    }))
  }

  parserPersonalities(personalities: IPersonality[]): IPersonalityResponse[] {
    return personalities.map((personality) => ({
      id: personality.id,
      infos: {
        title: personality.title,
        description: personality.description,
        createdAt: personality.created_at,
      },
      collections: {
        referencesIt: {
          itensLength: personality?.persons?.length ?? 0,
          itens:
            personality?.persons?.map((ref) => ({
              id: ref.id,
              name: { first: ref.name },
              image: {
                url: ref.image_url ?? undefined,
                alt: ref.name,
              },
            })) ?? [],
        },
        consequence: {
          itensLength: personality?.consequences?.length ?? 0,
          itens:
            personality.consequences?.map((consequence) => ({
              id: consequence.id,
              infos: {
                title: consequence.title,
                description: consequence.description,
                createdAt: consequence.created_at,
              },
              collections: {
                personality: personality.id,
              },
            })) ?? [],
        },
        comment: {
          itensLength: personality?.comments?.length ?? 0,
          itens: personality.comments ?? [],
        },
      },
    }))
  }

  parserObjectives(objectives: IObjective[]): IObjectiveResponse[] {
    return objectives.map((objective) => ({
      id: objective.id,
      infos: {
        title: objective.title,
        description: objective.description,
        createdAt: objective.created_at,
        itBeRealized: objective.it_be_realized,
      },
      collections: {
        referencesIt: {
          itensLength: objective?.persons?.length ?? 0,
          itens:
            objective?.persons?.map((ref) => ({
              id: ref.id,
              name: { first: ref.name },
              image: {
                url: ref.image_url ?? undefined,
                alt: ref.name,
              },
            })) ?? [],
        },
        avoider: {
          itensLength: objective?.avoiders?._count?.persons ?? 0,
          itens:
            objective.avoiders?.persons?.map((person) => ({
              id: person.id,
              name: { first: person.name },
              image: {
                url: person.image_url ?? undefined,
                alt: person.name,
              },
            })) ?? [],
        },
        supporter: {
          itensLength: objective?.supporters?._count?.persons ?? 0,
          itens:
            objective.supporters?.persons?.map((person) => ({
              id: person.id,
              name: { first: person.name },
              image: {
                url: person.image_url ?? undefined,
                alt: person.name,
              },
            })) ?? [],
        },
        comment: {
          itensLength: objective.comments?.length ?? 0,
          itens: objective.comments ?? [],
        },
      },
    }))
  }

  parserDreams(dreams: IDream[]): IDreamResponse[] {
    return dreams.map((dream) => ({
      id: dream.id,
      infos: {
        title: dream.title,
        description: dream.description,
        createdAt: dream.created_at,
      },
      collections: {
        referencesIt: {
          itensLength: dream?.persons?.length ?? 0,
          itens:
            dream?.persons?.map((ref) => ({
              id: ref.id,
              name: { first: ref.name },
              image: {
                url: ref.image_url ?? undefined,
                alt: ref.name,
              },
            })) ?? [],
        },
        comment: {
          itensLength: dream?.comments?.length ?? 0,
          itens: dream.comments ?? [],
        },
      },
    }))
  }

  parserFears(fears: IFear[]): IFearResponse[] {
    return fears.map((fear) => ({
      id: fear.id,
      infos: {
        title: fear.title,
        description: fear.description,
        createdAt: fear.created_at,
      },
      collections: {
        referencesIt: {
          itensLength: fear?.persons?.length ?? 0,
          itens:
            fear?.persons?.map((ref) => ({
              id: ref.id,
              name: { first: ref.name },
              image: {
                url: ref.image_url ?? undefined,
                alt: ref.name,
              },
            })) ?? [],
        },
        comment: {
          itensLength: fear?.comments?.length ?? 0,
          itens: fear.comments ?? [],
        },
      },
    }))
  }

  parserCouples(couples: ICouple[]): ICoupleResponse[] {
    return couples.map((couple) => ({
      id: couple.id,
      infos: {
        title: couple.title,
        description: couple.description,
        createdAt: couple.created_at,
        untilEnd: couple.until_end,
      },
      collections: {
        couple: {
          age: couple.coupleWithPerson!.person!.age,
          history: couple.coupleWithPerson!.person!.history,
          id: couple.coupleWithPerson!.person!.id,
          image: {
            alt: couple.coupleWithPerson!.person!.name,
            url: couple.coupleWithPerson!.person!.image_url ?? undefined,
          },
          name: { first: couple.coupleWithPerson!.person!.name },
        },
        comment: {
          itensLength: couple?.comments?.length ?? 0,
          itens: couple.comments ?? [],
        },
      },
    }))
  }

  parserAppearances(appearances: IAppearance[]): IAppearanceResponse[] {
    return appearances.map((appearance) => ({
      id: appearance.id,
      infos: {
        title: appearance.title,
        description: appearance.description,
        createdAt: appearance.created_at,
      },
      collections: {
        referencesIt: {
          itensLength: appearance?.persons?.length ?? 0,
          itens:
            appearance?.persons?.map((ref) => ({
              id: ref.id,
              name: { first: ref.name },
              image: {
                url: ref.image_url ?? undefined,
                alt: ref.name,
              },
            })) ?? [],
        },
        comment: {
          itensLength: appearance?.comments?.length ?? 0,
          itens: appearance.comments ?? [],
        },
      },
    }))
  }
}
