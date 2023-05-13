import { randomUUID } from 'node:crypto'
import path from 'path'
import { inject, injectable } from 'tsyringe'

import { env } from '@env/index'
import { IRefreshTokenRepository } from '@modules/accounts/infra/repositories/contracts/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IMailProvider } from '@shared/container/providers/MailProvider/IMailProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  email: string
}

@injectable()
export class SendForgotPasswordMailUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Repositories.RefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,

    @inject(InjectableDependencies.Providers.DateProvider)
    private readonly dateProvider: IDateProvider,

    @inject(InjectableDependencies.Providers.MailGunProvider)
    private readonly mailProvider: IMailProvider,
  ) {}

  async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)

    const templatePath = env.IS_DEV
      ? path.resolve(
          __dirname,
          '..',
          '..',
          'views',
          'emails',
          'forgotPassword.hbs',
        )
      : path.resolve(
          __dirname,
          '..',
          '..',
          '..',
          'modules',
          'accounts',
          'views',
          'emails',
          'forgotPassword.hbs',
        )

    if (!user) throw makeErrorUserNotFound()

    const token = randomUUID()
    const expiresDate = this.dateProvider.addHours(1).toString()

    await this.refreshTokenRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date: expiresDate,
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
