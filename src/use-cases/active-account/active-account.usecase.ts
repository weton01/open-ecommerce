import { Account } from '@/entities/account'
import { BadRequestError, ConflictError, NotFoundError } from '../common/errors'
import { Encrypter, Notifier } from '../common/packages'
import { FindByEmailAccountRepository, SaveAccountRepository } from '../common/repositories'
import { AccountAuthenticationDTO, ActiveAccountDTO } from './active-account.dtos'

export class ActiveAccount {
  constructor (
    private readonly accountRepository: SaveAccountRepository & FindByEmailAccountRepository,
    private readonly notifier: Notifier,
    private readonly accessEncrypter: Encrypter,
    private readonly refreshEncrypter: Encrypter
  ) { }

  async execute (dto: ActiveAccountDTO): Promise<AccountAuthenticationDTO> {
    const exists = await this.accountRepository.findByEmail(dto.email)
    if (exists == null) { throw new NotFoundError('Account not found') }
    if (exists.active) { throw new ConflictError('Account already active') }
    if (exists.activationCode !== dto.activationCode) { throw new BadRequestError('Invalid Code') }
    const account = Account.build(exists)
    const response = await this.accountRepository.save(account)
    const accessToken = this.accessEncrypter.encrypt({ id: response.id })
    const refreshToken = this.refreshEncrypter.encrypt({ id: response.id })
    await this.notifier.notify(account, {})
    return { account: response, accessToken, refreshToken }
  }
}
