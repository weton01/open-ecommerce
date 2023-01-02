import { FindByEmailAccountRepository, FindByIdAccountRepository, SaveAccountRepository } from '@/use-cases/common/repositories'
import { AccountDTO, CreateAccountDTO } from '@/use-cases/create-account/create-account.dtos'
import { PgUser } from './common/entities/user'
import { PgRepository } from './common/repository'

export class PgUserAccountRepository extends PgRepository
  implements FindByIdAccountRepository, FindByEmailAccountRepository, SaveAccountRepository {
  async save (account: CreateAccountDTO): Promise<AccountDTO> {
    const pgUserRepo = this.getRepository(PgUser)
    return await pgUserRepo.save(account)
  }

  async findByEmail (email: string): Promise<AccountDTO | undefined> {
    const pgUserRepo = this.getRepository(PgUser)
    const user = await pgUserRepo.findOne({ where: { email } })
    if (user !== null) { return user }
  }

  async findById (id: string): Promise<AccountDTO | undefined> {
    const pgUserRepo = this.getRepository(PgUser)
    const user = await pgUserRepo.findOne({ where: { id } })
    if (user !== null) { return user }
  }
}
