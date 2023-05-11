import { hashSync } from 'bcryptjs'

import { type ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'

export function createFakeUser(data?: ICreateUserDTO): ICreateUserDTO {
  const newUserTest: ICreateUserDTO = {
    name: data?.name ?? 'Unitary test to create user',
    email: data?.email ?? 'test@test.com',
    age: data?.age ?? '18',
    password: hashSync(data?.password ?? 'test123', 8),
    sex: data?.sex ?? 'test',
    username: data?.username ?? 'Test to create user',
    admin: data?.admin ?? false,
    avatar_filename: data?.avatar_filename ?? null,
  }

  return newUserTest
}
