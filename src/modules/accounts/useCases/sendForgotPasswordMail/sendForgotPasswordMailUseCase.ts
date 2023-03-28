import path from 'path'
import { inject, injectable } from 'tsyringe'
import { v4 as uuidV4 } from 'uuid'

import { env } from '@env/index'
import { IRefreshTokenRepository } from '@modules/accounts/infra/mongoose/repositories/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IMailProvider } from '@shared/container/providers/MailProvider/IMailProvider'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

@injectable()
export class SendForgotPasswordMailUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
    @inject('MailGunProvider')
    private readonly mailProvider: IMailProvider,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)

    const templatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'forgotPassword.hbs',
    )

    if (!user) throw makeErrorUserNotFound()

    const token = uuidV4()
    const expiresDate = this.dateProvider.addHours(1).toString()

    await this.refreshTokenRepository.create({
      refreshToken: token,
      userId: user.id,
      expiresDate,
    })

    const variables = {
      name: user.username,
      link: `${env.FORGOT_MAIL_URL}${token}`,
    }

    await this.mailProvider.sendMail({
      to: email,
      subject: 'Recuperação de senha...',
      path: templatePath,
      variables,
    })
  }
}
