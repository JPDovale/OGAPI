import { type IUpdatePersonDTO } from '@modules/persons/dtos/IUpdatePersonDTO'
import { type Prisma } from '@prisma/client'
import { prisma } from '@shared/infra/database/createConnection'

import { type IPersonsRepository } from '../../repositories/contracts/IPersonsRepository'
import { type IPerson } from '../../repositories/entities/IPerson'
import { type IUpdateImage } from '../../repositories/types/IUpdateImage'

const defaultInclude: Prisma.PersonInclude = {
  couples: {
    include: {
      coupleWithPerson: true,
    },
  },
  coupleWithPersons: true,
  appearances: true,
  dreams: true,
  fears: true,
  objectives: {
    include: {
      avoiders: {
        include: {
          persons: {
            select: {
              id: true,
              name: true,
              image_url: true,
            },
          },
        },
      },
      supporters: {
        include: {
          persons: {
            select: {
              id: true,
              name: true,
              image_url: true,
            },
          },
        },
      },
    },
  },
  personalities: {
    include: {
      consequences: true,
    },
  },
  powers: true,
  traumas: {
    include: {
      consequences: true,
    },
  },
  values: {
    include: {
      exceptions: true,
    },
  },
  wishes: true,
}
export class PersonsPrismaRepository implements IPersonsRepository {
  async create(
    data: Prisma.PersonUncheckedCreateInput,
  ): Promise<IPerson | null> {
    const person = await prisma.person.create({
      data,
      include: defaultInclude,
    })
    return person
  }

  async findById(personId: string): Promise<IPerson | null> {
    const person = await prisma.person.findFirst({
      where: {
        id: personId,
      },
      include: defaultInclude,
    })

    return person
  }

  async updateImage({
    image_filename,
    image_url,
    personId,
  }: IUpdateImage): Promise<IPerson | null> {
    const person = await prisma.person.update({
      where: {
        id: personId,
      },
      data: {
        image_filename,
        image_url,
      },
      include: defaultInclude,
    })

    return person
  }

  async updatePerson({
    data,
    personId,
  }: IUpdatePersonDTO): Promise<IPerson | null> {
    const person = await prisma.person.update({
      where: {
        id: personId,
      },
      data,
      include: defaultInclude,
    })

    return person
  }

  async listAll(): Promise<IPerson[]> {
    throw new Error('Method not implemented.')
  }

  async delete(personId: string): Promise<void> {
    await prisma.person.delete({
      where: {
        id: personId,
      },
    })
  }
}
