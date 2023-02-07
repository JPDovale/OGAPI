export interface ICreateUserTokenDTO {
  userId: string
  expiresDate: string
  refreshToken: string
  accessCode?: string
}
