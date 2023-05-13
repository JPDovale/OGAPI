export interface ISendMail {
  to: string
  subject: string
  variables: any
  path: string
}

export interface IRegisterInMailMarketing {
  email: string
  attributes: {
    NOME: string
  }
}

export interface IMailProvider {
  sendMail: ({ to, subject, variables, path }: ISendMail) => Promise<void>
  registerInMailMarketing: (contact: IRegisterInMailMarketing) => Promise<void>
}
