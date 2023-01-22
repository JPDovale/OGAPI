import path from 'path'
import { inject, injectable } from 'tsyringe'
import { v4 as uuidV4 } from 'uuid'

import { IRefreshTokenRepository } from '@modules/accounts/repositories/IRefreshTokenRepository'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { IMailProvider } from '@shared/container/provides/MailProvider/IMailProvider'
import { AppError } from '@shared/errors/AppError'

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

    if (!user) {
      throw new AppError({
        title: 'Usuário não encontrado.',
        message: 'Parece que esse usuário não existe na nossa base de dados...',
        statusCode: 404,
      })
    }

    try {
      const token = uuidV4()
      const expiresDate = this.dateProvider.addHours(1).toString()

      await this.refreshTokenRepository.create({
        refreshToken: token,
        userId: user.id,
        expiresDate,
      })

      const variables = {
        name: user.username,
        link: `${process.env.FORGOT_MAIL_URL}${token}`,
      }

      await this.mailProvider.sendMail({
        to: email,
        subject: 'Recuperação de senha...',
        path: templatePath,
        variables,
      })
    } catch (err) {
      console.log(err)
    }
  }
}
