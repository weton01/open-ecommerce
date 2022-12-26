import { FindByEmailAccountRepository, SaveAccountRepository } from '@/use-cases/common/repositories'
import { Hasher } from '@/use-cases/common/packages'
import { RecoverPasswordCbDTO } from './recover-password-cb.dtos'
import { Account, AccountError } from '@/entities/account'

export class RecoverPasswordCallback {
  constructor (
    private readonly accRepository: FindByEmailAccountRepository & SaveAccountRepository,
    private readonly hasher: Hasher
  ) {}

  async execute (dto: RecoverPasswordCbDTO): Promise<boolean> {
    const exists = await this.accRepository.findByEmail(dto.email)
    if (exists == null) { throw new AccountError(['Account not found'], 404) }
    const password = await this.hasher.hash(dto.password)
    const account = Account.build({ ...exists, password })
    await this.accRepository.save(account)
    return true
  }
}
