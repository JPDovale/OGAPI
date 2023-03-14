import { inject, injectable } from 'tsyringe'
import { v4 as uuidV4 } from 'uuid'

import { ICreateBoxDTO } from '@modules/boxes/dtos/ICrateBoxDTO'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'

import { BoxMongo } from '../../entities/schemas/Box'
import { IBox } from '../../entities/types/IBox'
import { IBoxesRepository } from '../IBoxesRepository'
import { IAddArchive } from '../types/IAddArchive'
import { IFindByNameAndProjectId } from '../types/IFindByNameAndProjectId'
import { IUpdateArchives } from '../types/IUpdateArchives'

@injectable()
export class BoxesMongoRepository implements IBoxesRepository {
  constructor(
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async create({
    name,
    description,
    tags,
    archives,
    internal,
    type,
    userId,
    projectId,
  }: ICreateBoxDTO): Promise<IBox> {
    const newBox = new BoxMongo({
      id: uuidV4(),
      name,
      description,
      userId,
      projectId,
      archives: archives || [],
      internal: internal || false,
      tags,
      type,
      createdAt: this.dateProvider.getDate(new Date()),
      updatedAt: this.dateProvider.getDate(new Date()),
    })

    await newBox.save()

    return newBox
  }

  async createMany(boxes: ICreateBoxDTO[]): Promise<void> {
    const createdBoxes = boxes.map((box) => {
      return {
        id: uuidV4(),
        name: box.name,
        userId: box.userId,
        projectId: box.projectId,
        archives: box.archives,
        internal: box.internal || false,
        tags: box.tags,
        type: box.type,
        createdAt: this.dateProvider.getDate(new Date()),
        updatedAt: this.dateProvider.getDate(new Date()),
      }
    })

    await BoxMongo.insertMany(createdBoxes)
  }

  async deletePerProjectId(projectId: string): Promise<void> {
    await BoxMongo.deleteMany({ projectId })
  }

  async findByUserId(userId: string): Promise<IBox[]> {
    const boxes = await BoxMongo.find({ userId })

    return boxes
  }

  async findPerProjectIds(projectIds: string[]): Promise<IBox[]> {
    const projectsIds = projectIds.map((id) => {
      return {
        projectId: id,
      }
    })

    const boxes = await BoxMongo.find({ $or: projectsIds })

    return boxes
  }

  async findByNameAndProjectId({
    name,
    projectId,
  }: IFindByNameAndProjectId): Promise<IBox> {
    const box = await BoxMongo.findOne({ name, projectId })

    return box
  }

  async addArchive({ archive, id }: IAddArchive): Promise<IBox> {
    await BoxMongo.updateOne(
      { id },
      {
        $push: { archives: archive },
        updatedAt: this.dateProvider.getDate(new Date()),
      },
    )

    const updatedBox = await BoxMongo.findOne({ id })
    return updatedBox
  }

  async updateArchives({ archives, id }: IUpdateArchives): Promise<IBox> {
    await BoxMongo.updateOne(
      { id },
      { archives, updatedAt: this.dateProvider.getDate(new Date()) },
    )

    const updatedBox = await BoxMongo.findOne({ id })
    return updatedBox
  }

  async listPerUser(userId: string): Promise<IBox[]> {
    const boxes = await BoxMongo.find({ userId })

    return boxes
  }

  async numberOfBoxesByUserId(userId: string): Promise<number> {
    const numbersOfRegister = await BoxMongo.countDocuments({ userId })

    return numbersOfRegister
  }

  async findNotInternalPerUserId(userId: string): Promise<IBox[]> {
    const boxesNotInternalThisUser = await BoxMongo.find({
      userId,
      internal: false,
    })

    return boxesNotInternalThisUser
  }

  async numberOfBoxesNotInternalByUserId(userId: string): Promise<number> {
    const numbersOfRegistersNotInternal = await BoxMongo.countDocuments({
      userId,
      internal: false,
    })

    return numbersOfRegistersNotInternal
  }
}
