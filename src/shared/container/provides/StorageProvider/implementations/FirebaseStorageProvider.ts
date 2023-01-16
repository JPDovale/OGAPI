import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import fs from 'fs'

import { storage } from '@config/storage'

import { IStorageProvider } from '../IStorageProvider'

export class FirebaseStorageProvider implements IStorageProvider {
  async upload(file: Express.Multer.File, toFolder: string): Promise<string> {
    const storageRef = ref(storage, `${toFolder}/${file.filename}`)

    const metadata = {
      contentType: file.mimetype,
    }

    const image = fs.readFileSync(file.path)

    const uploadTask = await uploadBytesResumable(storageRef, image, metadata)

    const url = await getDownloadURL(uploadTask.ref)

    return url
  }

  async delete(filename: string, toFolder: string): Promise<void> {
    const desertRef = ref(storage, `${toFolder}/${filename}`)

    await deleteObject(desertRef)
  }
}
