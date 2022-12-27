import { Account } from '@/entities/account'
import { NotFoundError } from '../common/errors'
import { Hasher } from '../common/packages'
import { FindByIdAccountRepository, SaveAccountRepository } from '../common/repositories'
import { AccountDTO } from '../create-account/create-account.dtos'
import { UpdateAccountDTO } from './update-account.dtos'

export class UpdateAccount {
  constructor (
    private readonly accRepository: FindByIdAccountRepository & SaveAccountRepository,
    private readonly hasher: Hasher
  ) {}

  async execute (dto: UpdateAccountDTO): Promise<AccountDTO> {
    const exists = await this.accRepository.findById(dto.id)
    if (exists === undefined) { throw new NotFoundError('Account not found') }
    const account = Account.build(exists)
    const password = await this.hasher.hash(dto.password)
    if (dto.password !== undefined) { account.changePassword(password) }
    const response = await this.accRepository.save(account)
    return response
  }
}
