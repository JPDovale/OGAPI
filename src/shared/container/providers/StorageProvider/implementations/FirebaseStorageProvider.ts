import {
  deleteObject,
  getDownloadURL,
  ref,
  type StorageReference,
  uploadBytesResumable,
} from 'firebase/storage'
import fs from 'node:fs'
import path from 'node:path'

import { storage } from '@config/storage'
import { env } from '@env/index'
import { makeErrorFileNotDeleted } from '@shared/errors/useFull/makeErrorFileNotDeleted'
import { makeErrorFileNotUploaded } from '@shared/errors/useFull/makeErrorFileNotUploaded'

import { type IStorageProvider } from '../IStorageProvider'

export class FirebaseStorageProvider implements IStorageProvider {
  async upload(file: Express.Multer.File, toFolder: string): Promise<string> {
    let storageRef: StorageReference

    try {
      storageRef = ref(storage, `${toFolder}/${file.filename}`)
    } catch (err) {
      console.log(err)
      throw makeErrorFileNotUploaded()
    }

    const metadata = {
      contentType: file.mimetype,
    }

    const folder = toFolder.split('/')[0]
    const filePath = env.IS_DEV
      ? path.resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          '..',
          '..',
          'tmp',
          folder,
          file.filename,
        )
      : path.resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'tmp',
          folder,
          file.filename,
        )

    const image = fs.readFileSync(filePath)

    let url: string

    try {
      const uploadTask = await uploadBytesResumable(storageRef, image, metadata)
      url = await getDownloadURL(uploadTask.ref)
    } catch (err) {
      console.log(err)
      throw makeErrorFileNotUploaded()
    }

    return url
  }

  async delete(filename: string, toFolder: string): Promise<void> {
    try {
      const desertRef = ref(storage, `${toFolder}/${filename}`)

      await deleteObject(desertRef)
    } catch (err) {
      console.log(err)
      throw makeErrorFileNotDeleted()
    }
  }
}
