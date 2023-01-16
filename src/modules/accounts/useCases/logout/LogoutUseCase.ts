import { inject, injectable } from 'tsyringe'

import { IRefreshTokenRepository } from '@modules/accounts/repositories/IRefreshTokenRepository'

@injectable()
export class LogoutUseCase {
  constructor(
    @inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.refreshTokenRepository.deletePerUserId(id)
  }
}
