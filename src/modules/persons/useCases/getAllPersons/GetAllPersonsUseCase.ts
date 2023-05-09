// import { inject, injectable } from 'tsyringe'

// import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
// import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'

// @injectable()
// export class GetAllPersonsUseCase {
//   constructor(
//     @inject('PersonsRepository')
//     private readonly personsRepository: IPersonsRepository,
//   ) {}

//   async execute(userId: string, projectId: string): Promise<IPersonMongo[]> {
//     const allPersonsThisUser =
//       await this.personsRepository.getPersonsPerProject(projectId)
//     return allPersonsThisUser
//   }
// }
