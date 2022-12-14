import { storage } from 'config/storage'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import fs from 'fs'

import { IStorageProvider } from '../IStorageProvider'

export class FirebaseStorageProvider implements IStorageProvider {
  async upload(file: Express.Multer.File, toFolder: 'avatar'): Promise<string> {
    const storageRef = ref(storage, `${toFolder}/${file.filename}`)

    const metadata = {
      contentType: file.mimetype,
    }

    const image = fs.readFileSync(file.path)

    const uploadTask = await uploadBytesResumable(storageRef, image, metadata)

    const url = await getDownloadURL(uploadTask.ref)

    return url
  }

  async delete(filename: string, toFolder: 'avatar'): Promise<void> {
    const desertRef = ref(storage, `${toFolder}/${filename}`)

    await deleteObject(desertRef)
  }
}
