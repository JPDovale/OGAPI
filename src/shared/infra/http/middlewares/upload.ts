import multer from 'multer'
import crypto from 'node:crypto'
import Path from 'node:path'

import { env } from '@env/index'
import { AppError } from '@shared/errors/AppError'
import { makeErrorInvalidArchive } from '@shared/errors/useFull/makeErrorInvalidArchive'

export class Uploads {
  upload: multer.Multer

  constructor(path: string, type: 'image') {
    const filePath = env.IS_DEV
      ? Path.resolve(__dirname, '..', '..', '..', '..', '..', 'tmp', path)
      : Path.resolve(__dirname, '..', '..', '..', '..', 'tmp', path)

    this.upload = multer({
      dest: `${filePath}`,
      storage: multer.diskStorage({
        destination: (req, file, callback) => {
          callback(null, `${filePath}`)
        },

        filename: (req, file, callback) => {
          crypto.randomBytes(16, (err, hash) => {
            if (err) {
              throw new AppError({
                title: 'Não foi possível realizar o upload',
                message: 'Não foi possível realizar o upload',
                statusCode: 500,
              })
            }

            const fileName = `${hash.toString('hex')}-${req.user.id}`

            callback(null, fileName)
          })
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
      fileFilter(req, file, callback) {
        let allow: string[] = []

        if (type === 'image') {
          allow = ['image/jpeg', 'image/png', 'image/pjpeg', 'image/jpg']
        }

        if (allow.includes(file.mimetype)) {
          callback(null, true)
        } else {
          callback(makeErrorInvalidArchive())
        }
      },
    })
  }
}
