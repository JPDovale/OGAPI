import { inject, injectable } from 'tsyringe'

import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'

import { ICreateBoxDTO } from '../dtos/ICrateBoxDTO'
import { IArchive } from '../infra/mongoose/entities/types/IArchive'
import { IBoxesRepository } from '../infra/mongoose/repositories/IBoxesRepository'

@injectable()
export class MigrateOldProjectsTagsToBoxesUseCase {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
    @inject('BoxesRepository')
    private readonly boxesRepository: IBoxesRepository,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute(): Promise<void> {
    const allProjects = await this.projectsRepository.listAll()

    const newBoxesMul = allProjects.map((project) => {
      const newBoxesToThisTags: ICreateBoxDTO[] = project?.tags?.map((tag) => {
        const newBoxToThisTag: ICreateBoxDTO = {
          name: tag.type,
          userId: project.createdPerUser,
          projectId: project.id,
          internal: true,
          tags: [
            {
              name: project.name,
            },
            {
              name: tag.type,
            },
          ],
          archives: tag?.refs?.map((ref) => {
            const INewArchive: IArchive = {
              archive: {
                id: ref.object.id,
                title: ref.object.title,
                description: ref.object.description,
                createdAt: this.dateProvider.getDate(new Date()),
                updatedAt: this.dateProvider.getDate(new Date()),
              },
              links: ref?.references?.map((reference) => {
                return { type: 'id', id: reference }
              }),
            }

            return INewArchive
          }),
        }

        return newBoxToThisTag
      })

      return newBoxesToThisTags
    })

    const newBoxes: ICreateBoxDTO[] = []

    newBoxesMul?.map((multiBoxes) =>
      multiBoxes?.map((box) => newBoxes.push(box)),
    )

    await this.boxesRepository.createMany(newBoxes)
    await this.projectsRepository.removeTagsInAllProjects()
  }
}
