import multer from 'multer'
import crypto from 'node:crypto'
import Path from 'node:path'

import { AppError } from '@shared/errors/AppError'

export class Uploads {
  upload: multer.Multer

  constructor(path: string, type: 'image') {
    const filePath = Path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'tmp',
      path,
    )

    this.upload = multer({
      dest: `${filePath}`,
      storage: multer.diskStorage({
        destination: (req, file, callback) => {
          callback(null, `${filePath}`)
        },

        filename: (req, file, callback) => {
          crypto.randomBytes(16, (err, hash) => {
            if (err) {
              return new AppError({
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
        let allow: string[]

        if (type === 'image') {
          allow = ['image/jpeg', 'image/png', 'image/pjpeg']
        }

        if (allow.includes(file.mimetype)) {
          callback(null, true)
        } else {
          callback(
            new AppError({
              title: 'Tipo de arquivo invalido.',
              message: 'Tipo de arquivo invalido.',
              statusCode: 415,
            }),
          )
        }
      },
    })
  }
}
