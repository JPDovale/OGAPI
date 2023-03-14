import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import fs from 'node:fs'
import path from 'node:path'

import { storage } from '@config/storage'
import { env } from '@env/index'

import { IStorageProvider } from '../IStorageProvider'

export class FirebaseStorageProvider implements IStorageProvider {
  async upload(file: Express.Multer.File, toFolder: string): Promise<string> {
    const storageRef = ref(storage, `${toFolder}/${file.filename}`)

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

    const uploadTask = await uploadBytesResumable(storageRef, image, metadata)

    const url = await getDownloadURL(uploadTask.ref)

    return url
  }

  async delete(filename: string, toFolder: string): Promise<void> {
    const desertRef = ref(storage, `${toFolder}/${filename}`)

    await deleteObject(desertRef)
  }
}
