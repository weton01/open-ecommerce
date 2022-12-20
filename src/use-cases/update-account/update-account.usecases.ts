import { Account, AccountError } from '@/entities/account'
import { Hasher } from '../common/contracts/packages'
import { FindByIdAccountRepository, SaveAccountRepository } from '../common/contracts/repositories'
import { AccountDTO } from '../create-account/create-account.dtos'
import { UpdateAccountDTO } from './update-account.dtos'

export class UpdateAccount {
  constructor (
    private readonly accRepository: FindByIdAccountRepository & SaveAccountRepository,
    private readonly hasher: Hasher
  ) {}

  async execute (dto: UpdateAccountDTO): Promise<AccountDTO> {
    const exists = await this.accRepository.findById(dto.id)
    if (exists === undefined) { throw new AccountError(['Account not found'], 400) }
    const account = Account.build(exists)
    const password = await this.hasher.hash(dto.password)
    if (dto.password !== undefined) { account.changePassword(password) }
    const response = await this.accRepository.save(account)
    return response
  }
}
