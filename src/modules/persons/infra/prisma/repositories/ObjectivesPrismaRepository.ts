import { type ICreateObjectiveDTO } from '@modules/persons/dtos/ICreateObjectiveDTO'
import { type IUpdateObjectiveDTO } from '@modules/persons/dtos/IUpdateObjectiveDTO'
import { type Objective, type Prisma } from '@prisma/client'
import { prisma } from '@shared/infra/database/createConnection'

import { type IObjectivesRepository } from '../../repositories/contracts/IObjectivesRepository'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

const defaultInclude: Prisma.ObjectiveInclude = {
  avoiders: {
    include: {
      persons: {
        select: {
          id: true,
        },
      },
    },
  },
  supporters: {
    include: {
      persons: {
        select: {
          id: true,
        },
      },
    },
  },
}

export class ObjectivesPrismaRepository implements IObjectivesRepository {
  async create(data: ICreateObjectiveDTO): Promise<Objective | null> {
    const objective = await prisma.objective.create({
      data,
      include: defaultInclude,
    })

    return objective
  }

  async findById(objectiveId: string): Promise<Objective | null> {
    const objective = await prisma.objective.findUnique({
      where: {
        id: objectiveId,
      },
      include: {
        ...defaultInclude,
        _count: {
          select: {
            persons: true,
          },
        },
      },
    })

    return objective
  }

  async delete(objectiveId: string): Promise<void> {
    await prisma.objective.delete({
      where: {
        id: objectiveId,
      },
    })
  }

  async removeOnePersonById({
    objectId,
    personId,
  }: IRemoveOnePersonById): Promise<void> {
    await prisma.objective.update({
      where: {
        id: objectId,
      },
      data: {
        persons: {
          delete: {
            id: personId,
          },
        },
      },
    })
  }

  async addPerson({
    objectId,
    personId,
  }: IAddOnePersonInObject): Promise<void> {
    await prisma.objective.update({
      where: {
        id: objectId,
      },
      data: {
        persons: {
          connect: {
            id: personId,
          },
        },
      },
    })
  }

  async update({
    data,
    objectiveId,
  }: IUpdateObjectiveDTO): Promise<Objective | null> {
    const objective = await prisma.objective.update({
      where: {
        id: objectiveId,
      },
      data,
      include: defaultInclude,
    })

    return objective
  }
}
