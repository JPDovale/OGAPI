import { randomUUID } from 'node:crypto'
import { inject, injectable } from 'tsyringe'

import { type ICreateManyUsersDTO } from '@modules/accounts/dtos/ICreateManyUsersDTO'
import { type IUserMongo } from '@modules/accounts/infra/mongoose/entities/User'
import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IArchive } from '@modules/boxes/infra/mongoose/entities/types/IArchive'
import { IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { type ICouple } from '@modules/persons/infra/mongoose/entities/Couple'
import { type IObjective } from '@modules/persons/infra/mongoose/entities/Objective'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import {
  type IConsequence,
  type IPersonality,
} from '@modules/persons/infra/mongoose/entities/Personality'
import { type ITrauma } from '@modules/persons/infra/mongoose/entities/Trauma'
import { type IValue } from '@modules/persons/infra/mongoose/entities/Value'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type ICreateResponseCommentDTO } from '@modules/projects/dtos/ICreateResponseCommentDTO'
import { type IComment } from '@modules/projects/infra/mongoose/entities/Comment'
import { type IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { ICommentsRepository } from '@modules/projects/infra/repositories/contracts/ICommentsRepository'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { type Prisma } from '@prisma/client'
import InjectableDependencies from '@shared/container/types'
import { prisma } from '@shared/infra/database/createConnection'

interface IOTC {
  archive: IArchive
  avoiders: string[]
  supporters: string[]
  realized: boolean
}

interface IPersonaTC {
  archive: IArchive
  consequences: IConsequence[]
}

interface IVTC {
  archive: IArchive
  exceptions: IConsequence[]
}

@injectable()
export class MigrateUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UserMongoRepository)
    private readonly usersMongoRepository: IUsersRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Repositories.ProjectMongoRepository)
    private readonly projectsMongoRepository: IProjectsRepository,

    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Repositories.PersonMongoRepository)
    private readonly personsMongoRepository: IPersonsRepository,

    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Repositories.BoxesRepository)
    private readonly boxesRepository: IBoxesRepository,

    @inject(InjectableDependencies.Repositories.CommentsRepository)
    private readonly commentsRepository: ICommentsRepository,
  ) {}

  async execute(): Promise<void> {
    const users = await this.usersMongoRepository.list()

    const projects = await this.projectsMongoRepository.listAll()

    const persons = await this.personsMongoRepository.listAll()

    const boxes = await this.boxesRepository.listInternals()
    const boxesFiltered = boxes.filter(
      (b) => b.name !== 'persons' && b.name !== 'books',
    )

    const couplesToCreate: IArchive[] = []
    persons.map((p) => {
      const pM = p as unknown as IPersonMongo

      return pM.couples?.map((c) =>
        couplesToCreate.push({
          archive: {
            id: c.id,
            title: c.title,
            description: c.description,
            createdAt: `${c.final}`,
            updatedAt: `${pM.id}`,
          },
          links: [{ id: c.personId, type: 'id' }],
          images: [],
        }),
      )
    })

    const allObjetives: IObjective[] = []
    persons.map((p) => {
      const pm = p as unknown as IPersonMongo

      return pm.objectives.map((o) => allObjetives.push(o))
    })

    const allPersonalities: IPersonality[] = []
    persons.map((p) => {
      const pm = p as unknown as IPersonMongo

      return pm.personality.map((p) => allPersonalities.push(p))
    })

    const allValues: IValue[] = []
    persons.map((p) => {
      const pm = p as unknown as IPersonMongo

      return pm.values.map((p) => allValues.push(p))
    })

    const allTraumas: ITrauma[] = []
    persons.map((p) => {
      const pm = p as unknown as IPersonMongo

      return pm.traumas.map((p) => allTraumas.push(p))
    })

    const objetiveToCreate: IOTC[] = []
    const personalitiesToCreate: IPersonaTC[] = []
    const traumasToCreate: IPersonaTC[] = []
    const valuesToCreate: IVTC[] = []

    const boxA = boxesFiltered.filter((b) => b.name === 'persons/appearance')
    const appearanceToCreate: IArchive[] = []
    boxA.map((b) => b.archives.map((a) => appearanceToCreate.push(a)))

    const boxO = boxesFiltered.filter((b) => b.name === 'persons/objectives')
    boxO.map((b) =>
      b.archives.map((a) => {
        const objetive = allObjetives.find((o) => o.id === a.archive.id)

        return objetiveToCreate.push({
          archive: a,
          avoiders: objetive?.avoiders ?? [],
          supporters: objetive?.supporting ?? [],
          realized: objetive?.objectified ?? false,
        })
      }),
    )

    const boxD = boxesFiltered.filter((b) => b.name === 'persons/dreams')
    const dreamsToCreate: IArchive[] = []
    boxD.map((b) => b.archives.map((a) => dreamsToCreate.push(a)))

    const boxF = boxesFiltered.filter((b) => b.name === 'persons/fears')
    const fearsToCreate: IArchive[] = []
    boxF.map((b) => b.archives.map((a) => fearsToCreate.push(a)))

    const boxP = boxesFiltered.filter((b) => b.name === 'persons/personality')
    boxP.map((b) =>
      b.archives.map((a) => {
        const personality = allPersonalities.find((p) => p.id === a.archive.id)

        return personalitiesToCreate.push({
          archive: a,
          consequences: personality?.consequences ?? [],
        })
      }),
    )

    const boxPO = boxesFiltered.filter((b) => b.name === 'persons/powers')
    const powersToCreate: IArchive[] = []
    boxPO.map((b) => b.archives.map((a) => powersToCreate.push(a)))

    const boxT = boxesFiltered.filter((b) => b.name === 'persons/traumas')
    boxT.map((b) =>
      b.archives.map((a) => {
        const trauma = allTraumas.find((t) => t.id === a.archive.id)

        return traumasToCreate.push({
          archive: a,
          consequences: trauma?.consequences ?? [],
        })
      }),
    )

    const boxV = boxesFiltered.filter((b) => b.name === 'persons/values')
    boxV.map((b) =>
      b.archives.map((a) => {
        const value = allValues.find((v) => v.id === a.archive.id)

        return valuesToCreate.push({
          archive: a,
          exceptions: value?.exceptions ?? [],
        })
      }),
    )

    const boxW = boxesFiltered.filter((b) => b.name === 'persons/wishes')
    const wishesToCreate: IArchive[] = []
    boxW.map((b) => b.archives.map((a) => wishesToCreate.push(a)))

    const toCreate = {
      appearanceToCreate,
      objetiveToCreate,
      couplesToCreate,
      dreamsToCreate,
      fearsToCreate,
      personalitiesToCreate,
      powersToCreate,
      traumasToCreate,
      valuesToCreate,
      wishesToCreate,
    }

    const manyUsersToCreate: ICreateManyUsersDTO = users.map((user) => {
      const userM = user as unknown as IUserMongo

      return {
        email: userM.email,
        name: userM.name,
        password: userM.password,
        username: userM.username,
        admin: userM.admin,
        age: userM.age,
        avatar_url: userM.avatar?.url,
        avatar_filename: userM.avatar?.fileName,
        id: userM.id,
        sex: userM.sex,
      }
    })

    await this.usersRepository.createMany(manyUsersToCreate)

    await Promise.all(
      projects.map(async (project) => {
        const projectM = project as unknown as IProjectMongo

        const usersView: Array<{ id: string }> = []
        const usersEdit: Array<{ id: string }> = []
        const usersComment: Array<{ id: string }> = []

        projectM.users.map((u) => {
          if (u.id !== projectM.createdPerUser) {
            switch (u.permission) {
              case 'comment':
                usersComment.push({ id: u.id })
                break

              case 'edit':
                usersEdit.push({ id: u.id })
                break

              case 'view':
                usersView.push({ id: u.id })

                break

              default:
                break
            }
          }
          return ''
        })

        await this.projectsRepository.create({
          name: projectM.name,
          type: projectM.type,
          user_id: projectM.createdPerUser,
          ambient: projectM.plot.ambient ?? null,
          count_time: projectM.plot.countTime ?? null,
          details: projectM.plot.details ?? null,
          historical_fact: projectM.plot.historicalFact ?? null,
          id: projectM.id,
          image_filename: projectM.image.fileName ?? null,
          image_url: projectM.image.url ?? null,
          literary_genre: projectM.plot.literaryGenere ?? null,
          one_phrase: projectM.plot.onePhrase ?? null,
          password: projectM.password ?? null,
          premise: projectM.plot.premise ?? null,
          private: projectM.private,
          storyteller: projectM.plot.storyteller ?? null,
          structure_act_1: projectM.plot.structure.act1 ?? null,
          structure_act_2: projectM.plot.structure.act2 ?? null,
          structure_act_3: projectM.plot.structure.act3 ?? null,
          subgenre: projectM.plot.subgenre ?? null,
          summary: projectM.plot.summary ?? null,
          url_text: projectM.plot.urlOfText ?? null,
          users_with_access_view:
            usersView.length > 0
              ? {
                  create: {
                    users: {
                      connect: usersView,
                    },
                  },
                }
              : undefined,
          users_with_access_edit:
            usersEdit.length > 0
              ? {
                  create: {
                    users: {
                      connect: usersEdit,
                    },
                  },
                }
              : undefined,
          users_with_access_comment:
            usersComment.length > 0
              ? {
                  create: {
                    users: {
                      connect: usersComment,
                    },
                  },
                }
              : undefined,
        })

        const commentsInProject = projectM.plot.comments

        commentsInProject.map(async (comment) => {
          const responsesToCreate: Prisma.ResponseCommentCreateManyCommentInput[] =
            []

          comment.responses.map((res) =>
            responsesToCreate.push({
              content: res.content,
              user_id: res.userId,
              id: res.id,
            }),
          )

          await this.commentsRepository.create({
            user_id: comment.userId,
            content: comment.content,
            id: comment.id,
            project_id: projectM.id,
            to_unknown: comment.to,
            responses: {
              createMany: {
                data: responsesToCreate,
              },
            },
          })
        })
      }),
    ).catch((err) => {
      throw err
    })

    await Promise.all(
      persons.map(async (p) => {
        const pm = p as unknown as IPersonMongo

        await this.personsRepository.create({
          id: pm.id,
          age: Number(pm.age),
          history: pm.history,
          image_filename: pm.image?.fileName,
          image_url: pm.image?.url,
          name: pm.name,
          last_name: pm.lastName,
          project_id: pm.defaultProject,
          user_id: pm.fromUser,
        })
      }),
    ).catch((err) => {
      throw err
    })

    await Promise.all(
      toCreate.appearanceToCreate.map(async (atc) => {
        const connectLinks = atc.links.map((l) => {
          return {
            id: l.id,
          }
        })

        await prisma.appearance.create({
          data: {
            title: atc.archive.title,
            description: atc.archive.description,
            id: atc.archive.id,
            persons: {
              connect: connectLinks,
            },
          },
        })
      }),
    ).catch((err) => {
      throw err
    })

    await Promise.all(
      toCreate.couplesToCreate.map(async (ctc) => {
        const final = JSON.parse(ctc.archive.createdAt) as boolean
        const personId = ctc.links[0].id

        await prisma.couple.create({
          data: {
            title: ctc.archive.title,
            description: ctc.archive.description,
            until_end: final,
            id: ctc.archive.id,
            person: {
              connect: {
                id: ctc.archive.updatedAt,
              },
            },
            coupleWithPerson: {
              create: {
                person: {
                  connect: {
                    id: personId,
                  },
                },
              },
            },
          },
        })
      }),
    ).catch((err) => {
      throw err
    })

    await Promise.all(
      toCreate.dreamsToCreate.map(async (dct) => {
        const connectLinks = dct.links.map((l) => {
          return {
            id: l.id,
          }
        })

        await prisma.dream.create({
          data: {
            title: dct.archive.title,
            description: dct.archive.description,
            id: dct.archive.id,
            persons: {
              connect: connectLinks,
            },
          },
        })
      }),
    ).catch((err) => {
      throw err
    })

    await Promise.all(
      toCreate.fearsToCreate.map(async (fct) => {
        const connectLinks = fct.links.map((l) => {
          return {
            id: l.id,
          }
        })

        await prisma.fear.create({
          data: {
            title: fct.archive.title,
            description: fct.archive.description,
            id: fct.archive.id,
            persons: {
              connect: connectLinks,
            },
          },
        })
      }),
    ).catch((err) => {
      throw err
    })

    await Promise.all(
      toCreate.objetiveToCreate.map(async (oct) => {
        const connectLinks = oct.archive.links.map((l) => {
          return {
            id: l.id,
          }
        })

        const avoiders = oct.avoiders.map((a) => {
          return {
            id: a,
          }
        })

        const supporters = oct.avoiders.map((a) => {
          return {
            id: a,
          }
        })

        await prisma.objective.create({
          data: {
            title: oct.archive.archive.title,
            description: oct.archive.archive.description,
            id: oct.archive.archive.id,
            it_be_realized: oct.realized,
            avoiders: {
              create: {
                persons: {
                  connect: avoiders,
                },
              },
            },
            supporters: {
              create: {
                persons: {
                  connect: supporters,
                },
              },
            },
            persons: {
              connect: connectLinks,
            },
          },
        })
      }),
    ).catch((err) => {
      throw err
    })

    await Promise.all(
      toCreate.personalitiesToCreate.map(async (pct) => {
        const connectLinks = pct.archive.links.map((l) => {
          return {
            id: l.id,
          }
        })

        const consequencesToCreate: Prisma.ConsequenceCreateManyInput[] = []

        pct.consequences.map((c) => {
          return consequencesToCreate.push({
            title: c.title,
            description: c.description,
          })
        })

        await prisma.personality.create({
          data: {
            title: pct.archive.archive.title,
            description: pct.archive.archive.description,
            id: pct.archive.archive.id,
            persons: {
              connect: connectLinks,
            },
            consequences: {
              createMany: {
                data: consequencesToCreate,
              },
            },
          },
        })
      }),
    ).catch((err) => {
      throw err
    })

    await Promise.all(
      toCreate.powersToCreate.map(async (pct) => {
        const connectLinks = pct.links.map((l) => {
          return {
            id: l.id,
          }
        })

        await prisma.power.create({
          data: {
            title: pct.archive.title,
            description: pct.archive.description,
            id: pct.archive.id,
            persons: {
              connect: connectLinks,
            },
          },
        })
      }),
    ).catch((err) => {
      throw err
    })

    await Promise.all(
      toCreate.traumasToCreate.map(async (tct) => {
        const connectLinks = tct.archive.links.map((l) => {
          return {
            id: l.id,
          }
        })

        const consequencesToCreate: Prisma.ConsequenceCreateManyInput[] = []

        tct.consequences.map((c) => {
          return consequencesToCreate.push({
            title: c.title,
            description: c.description,
          })
        })

        await prisma.trauma.create({
          data: {
            title: tct.archive.archive.title,
            description: tct.archive.archive.description,
            id: tct.archive.archive.id,
            consequences: {
              createMany: {
                data: consequencesToCreate,
              },
            },
            persons: {
              connect: connectLinks,
            },
          },
        })
      }),
    ).catch((err) => {
      throw err
    })

    await Promise.all(
      toCreate.valuesToCreate.map(async (vct) => {
        const connectLinks = vct.archive.links.map((l) => {
          return {
            id: l.id,
          }
        })

        const exceptionToCreate: Prisma.ExceptionCreateManyInput[] = []

        vct.exceptions.map((e) => {
          return exceptionToCreate.push({
            title: e.title,
            description: e.description,
          })
        })

        await prisma.value.create({
          data: {
            title: vct.archive.archive.title,
            description: vct.archive.archive.description,
            id: vct.archive.archive.id,
            exceptions: {
              createMany: {
                data: exceptionToCreate,
              },
            },
            persons: {
              connect: connectLinks,
            },
          },
        })
      }),
    ).catch((err) => {
      throw err
    })

    await Promise.all(
      toCreate.wishesToCreate.map(async (wct) => {
        const connectLinks = wct.links.map((l) => {
          return {
            id: l.id,
          }
        })

        await prisma.wishe.create({
          data: {
            title: wct.archive.title,
            description: wct.archive.description,
            id: wct.archive.id,
            persons: {
              connect: connectLinks,
            },
          },
        })
      }),
    ).catch((err) => {
      throw err
    })
  }
}
