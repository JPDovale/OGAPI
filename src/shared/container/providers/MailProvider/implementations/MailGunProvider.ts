import handlebars from 'handlebars'
import fs from 'node:fs'
import nodemailer, { type Transporter } from 'nodemailer'
import { injectable } from 'tsyringe'

import { env } from '@env/index'

import { type IMailProvider, type ISendMail } from '../IMailProvider'

@injectable()
export class MailGunProvider implements IMailProvider {
  private readonly client: Transporter

  constructor() {
    this.client = nodemailer.createTransport({
      host: env.MAILGUN_HOST,
      port: Number(env.MAILGUN_PORT),
      auth: {
        user: env.MAILGUN_DOMAIN,
        pass: env.MAILGUN_PASS,
      },
    })
  }

  async sendMail({ to, variables, path, subject }: ISendMail): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8')

    const templateParse = handlebars.compile(templateFileContent)
    const templateHTML = templateParse(variables)

    await this.client.sendMail({
      to: `${to}`,
      from: 'MagiScrita | <noreply@ognare.com.br>',
      subject,
      html: templateHTML,
      watchHtml: templateHTML,
    })
  }
}
