import { hashSync } from 'bcryptjs'

import { fakerPT_BR } from '@faker-js/faker'
import { type ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'

export function createFakeUser(data?: ICreateUserDTO): ICreateUserDTO {
  const newUserTest: ICreateUserDTO = {
    name: data?.name ?? fakerPT_BR.person.fullName(),
    email: data?.email ?? fakerPT_BR.internet.email(),
    age: data?.age ?? fakerPT_BR.number.int({ min: 16, max: 70 }).toString(),
    password: hashSync(data?.password ?? fakerPT_BR.internet.password(), 8),
    sex: data?.sex ?? fakerPT_BR.person.gender(),
    username: data?.username ?? fakerPT_BR.internet.userName(),
    admin: data?.admin ?? false,
    avatar_filename: data?.avatar_filename ?? null,
  }

  return newUserTest
}
