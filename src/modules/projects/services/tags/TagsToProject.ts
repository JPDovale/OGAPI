import { inject, injectable } from 'tsyringe'

import { IRef, ITag, Tag } from '@modules/projects/infra/mongoose/entities/Tag'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { AppError } from '@shared/errors/AppError'

interface IObject {
  id?: string
  title?: string
  description?: string
}

@injectable()
export class TagsToProject {
  constructor(
    @inject('DateProvider') private readonly dateProvider: IDateProvider,
  ) {}

  async createOrUpdate(
    projectTags: ITag[],
    type: string,
    objects: IObject[],
    references: string[],
    projectName: string,
  ): Promise<ITag[]> {
    let tags: ITag[] = projectTags.filter(
      (projectTag) => projectTag.type !== type,
    )
    const tagExiste = projectTags.find((projectTag) => projectTag.type === type)

    if (!tagExiste) {
      const newTagType = new Tag({
        type,
        origPath: `${projectName}/${type}`,
        refs: objects.map((object) => {
          return {
            object: {
              id: object.id,
              title: object.title,
              description: object.description,
            },
            references,
          }
        }),
      })

      tags = [newTagType, ...tags]
    } else {
      const newRefs: IRef[] = objects.map((object) => {
        return {
          object: {
            id: object.id,
            title: object.title,
            description: object.description,
          },
          references,
        }
      })

      const updateTagType: ITag = {
        ...tagExiste,
        refs: [...tagExiste.refs, ...newRefs],
        updateAt: this.dateProvider.getDate(new Date()).toString(),
      }

      tags = [updateTagType, ...tags]
    }

    return tags
  }

  async createOrUpdatePersons(
    projectTags: ITag[],
    references: string[],
    projectName: string,
  ): Promise<ITag[]> {
    let tags: ITag[] = projectTags.filter(
      (projectTag) => projectTag.type !== 'persons',
    )
    const tagExiste = projectTags.find(
      (projectTag) => projectTag.type === 'persons',
    )

    const isNew = !!tagExiste
    const refs = [
      {
        object: {},
        references: isNew
          ? [...tagExiste.refs[0].references, ...references]
          : references,
      },
    ]

    if (!tagExiste) {
      const newTagType = new Tag({
        type: 'persons',
        origPath: `${projectName}/persons`,
        refs,
      })

      tags = [newTagType, ...tags]
    } else {
      const updateTagType: ITag = {
        ...tagExiste,
        refs,
        updateAt: this.dateProvider.getDate(new Date()).toString(),
      }

      tags = [updateTagType, ...tags]
    }

    return tags
  }

  async updatePersonsTagsObject(
    tagType: string,
    objectId: string,
    newObject: IObject,
    projectTags: ITag[],
  ): Promise<ITag[]> {
    const existeTag = projectTags.find((tag) => tag.type === tagType)
    const filteredTags = projectTags.filter((tag) => tag.type !== tagType)

    const reference = existeTag.refs.find((ref) => ref.object.id === objectId)
    const filteredReferences = existeTag.refs.filter(
      (ref) => ref.object.id !== objectId,
    )

    if (!reference)
      throw new AppError({
        title: 'Impossível verificar a origem das tags do projeto',
        message: `Impossível verificar a origem das tags do projeto`,
        statusCode: 404,
      })

    const updatedReferenceObject: IRef = {
      ...reference,
      object: { ...reference.object, ...newObject },
    }

    const updatedTag: ITag = {
      ...existeTag,
      refs: [...filteredReferences, updatedReferenceObject],
    }

    const tags = [...filteredTags, updatedTag]

    return tags
  }

  async deleteReferenceTag(
    tagType: string,
    objectId: string,
    objeteReferencieToDelete: string,
    projectTags: ITag[],
  ): Promise<ITag[]> {
    const existeTag = projectTags.find((tag) => tag.type === tagType)
    const filteredTags = projectTags.filter((tag) => tag.type !== tagType)

    const filteredReferences = existeTag.refs.filter(
      (ref) => ref.object.id !== objectId,
    )
    const reference = existeTag.refs.find((ref) => ref.object.id === objectId)

    const noMorePersonsOnTag = reference.references.length === 1

    if (noMorePersonsOnTag) {
      const updatedTag: ITag = { ...existeTag, refs: [...filteredReferences] }
      const tags = [...filteredTags, updatedTag]

      return tags
    } else {
      const filteredReferencesObject = reference.references.filter(
        (item) => item !== objeteReferencieToDelete,
      )

      const updatedReference: IRef = {
        ...reference,
        references: [...filteredReferencesObject],
      }

      const updatedTag: ITag = {
        ...existeTag,
        refs: [...filteredReferences, updatedReference],
      }

      const tags = [...filteredTags, updatedTag]
      return tags
    }
  }
}
