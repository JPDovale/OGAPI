import axios, { type AxiosInstance } from 'axios'
import handlebars from 'handlebars'
import fs from 'node:fs'
import { injectable } from 'tsyringe'

import { env } from '@env/index'
import { AppError } from '@shared/errors/AppError'

import {
  type IRegisterInMailMarketing,
  type IMailProvider,
  type ISendMail,
} from '../IMailProvider'

@injectable()
export class SendinBlueProvider implements IMailProvider {
  private readonly apiKey = env.SENDINBLUE_API_KEY
  private readonly apiSendinblue: AxiosInstance

  constructor() {
    const apiSendinblueInitialized = axios.create({
      baseURL: 'https://api.sendinblue.com/v3/',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    apiSendinblueInitialized.defaults.headers.common['api-key'] = this.apiKey

    this.apiSendinblue = apiSendinblueInitialized
  }

  async sendMail({ to, variables, path, subject }: ISendMail): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8')

    const templateParse = handlebars.compile(templateFileContent)
    const templateHTML = templateParse(variables)

    const emailData = {
      sender: {
        name: 'MagiScrita',
        email: 'noReply@magiscrita.com',
      },
      to: [
        {
          email: to,
          name: variables.name,
        },
      ],
      subject,
      htmlContent: templateHTML,
    }

    try {
      await this.apiSendinblue.post('/smtp/email', emailData)
    } catch (err) {
      console.log(err.response.data)
      throw new AppError({
        title: 'Error ao enviar email',
        message: 'Houve um erro interno ao tentar enviar o email',
        statusCode: 500,
      })
    }
  }

  async registerInMailMarketing(
    contact: IRegisterInMailMarketing,
  ): Promise<void> {
    try {
      await this.apiSendinblue.post('/contacts', contact)
    } catch (err) {
      console.log(err.response.data)
    }
  }
}
