import { v4 as uuidV4 } from 'uuid'

import { type ICreateBoxDTO } from '@modules/boxes/dtos/ICrateBoxDTO'
import { type IUpdateBoxDTO } from '@modules/boxes/dtos/IUpdateBoxDTO'

import { BoxMongo } from '../../entities/schemas/Box'
import { type IBox } from '../../entities/types/IBox'
import { type IBoxesRepository } from '../IBoxesRepository'
import { type IAddArchive } from '../types/IAddArchive'
import { type IFindByNameAndProjectId } from '../types/IFindByNameAndProjectId'
import { type IUpdateArchives } from '../types/IUpdateArchives'

export class BoxesRepositoryInMemory implements IBoxesRepository {
  boxes: IBox[] = []

  async create({
    name,
    description,
    tags,
    userId,
    archives,
    internal,
    projectId,
    type,
  }: ICreateBoxDTO): Promise<IBox | null | undefined> {
    const newBox = new BoxMongo({
      archives: archives ?? [],
      description: description ?? '',
      createdAt: new Date(),
      id: uuidV4(),
      internal: internal ?? false,
      name,
      projectId: projectId ?? '',
      tags: tags ?? [],
      type,
      updatedAt: new Date(),
      userId,
    })

    this.boxes.push(newBox)

    return newBox
  }

  async createMany(boxesToCreate: ICreateBoxDTO[]): Promise<void> {
    boxesToCreate.map((box) => {
      const newBox = new BoxMongo({
        archives: box.archives ?? [],
        createdAt: new Date(),
        id: uuidV4(),
        internal: box.internal ?? false,
        name: box.name,
        projectId: box.projectId ?? '',
        tags: box.tags ?? [],
        type: box.type,
        updatedAt: new Date(),
        userId: box.userId,
      })

      this.boxes.push(newBox)
      return ''
    })
  }

  async deletePerProjectId(projectId: string): Promise<void> {
    const filteredBoxes = this.boxes.filter(
      (box) => box.projectId !== projectId,
    )

    this.boxes = filteredBoxes
  }

  async findByUserId(userId: string): Promise<IBox[]> {
    const filteredBoxes = this.boxes.filter((box) => box.userId === userId)

    return filteredBoxes
  }

  async findPerProjectIds(projectIds: string[]): Promise<IBox[]> {
    let boxesToReturn: IBox[] = []

    projectIds.map((projectId) => {
      const findBoxesToProjectId = this.boxes.filter(
        (box) => box.projectId === projectId,
      )

      boxesToReturn = [...findBoxesToProjectId, ...boxesToReturn]

      return ''
    })

    return boxesToReturn
  }

  async findByNameAndProjectId({
    name,
    projectId,
  }: IFindByNameAndProjectId): Promise<IBox | null | undefined> {
    const box = this.boxes.find(
      (box) => box.name === name && box.projectId === projectId,
    )

    return box
  }

  async addArchive({
    archive,
    id,
  }: IAddArchive): Promise<IBox | null | undefined> {
    const indexOfBoxToEdit = this.boxes.findIndex((box) => box.id === id)

    this.boxes[indexOfBoxToEdit].archives.push(archive)

    const updatedBox = this.boxes.find((box) => box.id === id)

    return updatedBox
  }

  async updateArchives({
    archives,
    id,
  }: IUpdateArchives): Promise<IBox | null | undefined> {
    const indexOfBoxToEdit = this.boxes.findIndex((box) => box.id === id)

    this.boxes[indexOfBoxToEdit].archives = archives

    const updatedBox = this.boxes.find((box) => box.id === id)

    return updatedBox
  }

  async listPerUser(userId: string): Promise<IBox[]> {
    const filteredBoxes = this.boxes.filter((box) => box.userId === userId)

    return filteredBoxes
  }

  async numberOfBoxesByUserId(userId: string): Promise<number> {
    const filteredBoxes = this.boxes.filter((box) => box.userId === userId)

    return filteredBoxes.length
  }

  async findNotInternalPerUserId(userId: string): Promise<IBox[]> {
    const boxesNotInternalThisUser = this.boxes.filter(
      (box) => box.userId === userId && !box.internal,
    )

    return boxesNotInternalThisUser
  }

  async numberOfBoxesNotInternalByUserId(userId: string): Promise<number> {
    const filteredBoxes = this.boxes.filter(
      (box) => box.userId === userId && !box.internal,
    )

    return filteredBoxes.length
  }

  async findById(boxId: string): Promise<IBox | null | undefined> {
    const box = this.boxes.find((box) => box.id === boxId)

    return box
  }

  async update({
    id,
    description,
    name,
    tags,
  }: IUpdateBoxDTO): Promise<IBox | null | undefined> {
    const indexOfBoxToEdit = this.boxes.findIndex((box) => box.id === id)

    this.boxes[indexOfBoxToEdit].name = name
    this.boxes[indexOfBoxToEdit].description = description
    this.boxes[indexOfBoxToEdit].tags = tags

    const updatedBox = this.boxes.find((box) => box.id === id)

    return updatedBox
  }

  async deletePerId(id: string): Promise<void> {
    this.boxes = this.boxes.filter((box) => box.id !== id)
  }
}
