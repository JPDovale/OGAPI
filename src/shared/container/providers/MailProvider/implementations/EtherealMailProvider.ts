import fs from 'fs'
import handlebars from 'handlebars'
import nodemailer, { type Transporter } from 'nodemailer'
import { injectable } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import {
  type IRegisterInMailMarketing,
  type IMailProvider,
  type ISendMail,
} from '../IMailProvider'

@injectable()
export class EtherealMailProvider implements IMailProvider {
  private client: Transporter

  constructor() {
    nodemailer
      .createTestAccount()
      .then((account) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        })

        this.client = transporter
      })
      .catch((err) => {
        console.error(err)

        throw new AppError({
          title: 'Internal error',
          message: 'Try again later.',
          statusCode: 500,
        })
      })
  }

  async sendMail({ to, variables, path, subject }: ISendMail): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8')

    const templateParse = handlebars.compile(templateFileContent)
    const templateHTML = templateParse(variables)

    const message = await this.client.sendMail({
      to,
      from: 'Ognare | <noreply@ognare.com>',
      subject,
      html: templateHTML,
    })

    console.log('Message sent: %s', message.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))
  }

  async registerInMailMarketing(
    contact: IRegisterInMailMarketing,
  ): Promise<void> {
    console.log(contact, 'foi requisitado para salva na lista de contatos')
  }
}
