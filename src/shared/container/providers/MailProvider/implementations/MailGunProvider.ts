import dotenv from 'dotenv'
import fs from 'fs'
import handlebars from 'handlebars'
import nodemailer, { type Transporter } from 'nodemailer'
import { injectable } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { type IMailProvider, type ISendMail } from '../IMailProvider'
dotenv.config()

@injectable()
export class MailGunProvider implements IMailProvider {
  private readonly client: Transporter

  constructor() {
    this.client = nodemailer.createTransport({
      host: process.env.MAILGUN_HOST,
      port: Number(process.env.MAILGUN_PORT),
      auth: {
        user: process.env.MAILGUN_DOMAIN,
        pass: process.env.MAILGUN_PASS,
      },
    })
  }

  async sendMail({ to, variables, path, subject }: ISendMail): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8')

    const templateParse = handlebars.compile(templateFileContent)
    const templateHTML = templateParse(variables)

    await this.client.sendMail({
      to: `${to}`,
      from: 'Ognare | <noreply@ognare.com>',
      subject,
      html: templateHTML,
      watchHtml: templateHTML,
    })
  }
}
