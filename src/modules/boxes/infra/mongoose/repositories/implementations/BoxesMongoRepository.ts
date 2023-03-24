import { inject, injectable } from 'tsyringe'
import { v4 as uuidV4 } from 'uuid'

import { type ICreateBoxDTO } from '@modules/boxes/dtos/ICrateBoxDTO'
import { type IUpdateBoxDTO } from '@modules/boxes/dtos/IUpdateBoxDTO'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'

import { BoxMongo } from '../../entities/schemas/Box'
import { type IBox } from '../../entities/types/IBox'
import { type IBoxesRepository } from '../IBoxesRepository'
import { type IAddArchive } from '../types/IAddArchive'
import { type IFindByNameAndProjectId } from '../types/IFindByNameAndProjectId'
import { type IUpdateArchives } from '../types/IUpdateArchives'

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
  }: ICreateBoxDTO): Promise<IBox | null | undefined> {
    const newBox = new BoxMongo({
      id: uuidV4(),
      name,
      description,
      userId,
      projectId,
      archives: archives ?? [],
      internal: internal ?? false,
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
        internal: box.internal ?? false,
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
  }: IFindByNameAndProjectId): Promise<IBox | null | undefined> {
    const box = await BoxMongo.findOne({ name, projectId })

    return box
  }

  async addArchive({
    archive,
    id,
  }: IAddArchive): Promise<IBox | null | undefined> {
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

  async updateArchives({
    archives,
    id,
  }: IUpdateArchives): Promise<IBox | null | undefined> {
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

  async findById(id: string): Promise<IBox | null | undefined> {
    const box = await BoxMongo.findOne({ id })

    return box
  }

  async update({
    id,
    name,
    description,
    tags,
  }: IUpdateBoxDTO): Promise<IBox | null | undefined> {
    await BoxMongo.updateOne(
      {
        id,
      },
      {
        name,
        description,
        tags,
        updatedAt: this.dateProvider.getDate(new Date()),
      },
    )

    const box = await BoxMongo.findOne({ id })

    return box
  }

  async deletePerId(id: string): Promise<void> {
    await BoxMongo.deleteOne({ id })
  }
}
