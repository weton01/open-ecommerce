import { Hasher, Notifier } from '../common/contracts/packages'
import { FindByEmailAccountRepository, SaveAccountRepository } from '@/use-cases/common/contracts/repositories'
import { AccountDTO, CreateAccountDTO } from './create-account.dtos'
import { Account, AccountError } from '@/entities/account'

export class CreateAccount {
  constructor (
    private readonly findByEmailRepo: FindByEmailAccountRepository,
    private readonly saveAccount: SaveAccountRepository,
    private readonly notifier: Notifier,
    private readonly hasher: Hasher
  ) {}

  async execute (dto: CreateAccountDTO): Promise<AccountDTO> {
    const exists = await this.findByEmailRepo.findByEmail(dto.email)
    if (exists !== undefined) { throw new AccountError(['E-mail already exists']) }
    const password = await this.hasher.hash(dto.password)
    const account = Account.build({ ...dto, password })
    const dbCustomer = await this.saveAccount.save(account)
    await this.notifier.notify(account)
    return dbCustomer
  }
}
