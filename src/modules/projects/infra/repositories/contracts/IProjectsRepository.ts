import { type ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { type IUpdateProjectDTO } from '@modules/projects/dtos/IUpdateProjectDTO'
import { type IPreviewProject } from '@modules/projects/responses/IPreviewProject'

import { type IProject } from '../entities/IProject'
import { type IProjectToVerifyPermission } from '../entities/IProjectToVerifyPermission'
import { type IAddUsersInProject } from '../types/IAddUsersInProject'
import { type IUpdateImage } from '../types/IUpdateImage'

export abstract class IProjectsRepository {
  abstract create(data: ICreateProjectDTO): Promise<IProject | null>
  abstract findById(projectId: string): Promise<IProject | null>
  abstract addUsers(data: IAddUsersInProject): Promise<IProject | null>
  abstract updateImage(data: IUpdateImage): Promise<IProject | null>
  abstract delete(projectId: string): Promise<void>
  abstract update(data: IUpdateProjectDTO): Promise<IProject | null>
  abstract listAll(): Promise<IProject[]>
  abstract listProjectsOfOneUser(userId: string): Promise<IPreviewProject[]>
  abstract findOneToVerifyPermission(
    projectId: string,
  ): Promise<IProjectToVerifyPermission | null>
}
