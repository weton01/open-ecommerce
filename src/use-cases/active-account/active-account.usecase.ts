import { Account, AccountError } from '@/entities/account'
import { Configuration, Encrypter, Notifier } from '../common/contracts/packages'
import { FindByEmailAccountRepository, SaveAccountRepository } from '../common/contracts/repositories'
import { AccountAuthenticationDTO, ActiveAccountDTO } from './active-account.dtos'

export class ActiveAccount {
  constructor (
    private readonly accountRepository: SaveAccountRepository & FindByEmailAccountRepository,
    private readonly config: Configuration,
    private readonly notifier: Notifier,
    private readonly encrypter: Encrypter
  ) { }

  async execute (dto: ActiveAccountDTO): Promise<AccountAuthenticationDTO> {
    const exists = await this.accountRepository.findByEmail(dto.email)
    if (exists == null) { throw new AccountError(['Account not found'], 404) }
    if (exists.active) { throw new AccountError(['Account already active'], 400) }
    if (exists.activationCode !== dto.activationCode) { throw new AccountError(['Invalid Code'], 400) }
    const account = Account.build(exists)
    const response = await this.accountRepository.save(account)
    const accessToken = this.encrypter.encrypt({ id: response.id }, this.config.accessTokenSecret)
    const refreshToken = this.encrypter.encrypt({ id: response.id }, this.config.refreshTokenSecret)
    await this.notifier.notify(account, {})
    return { account: response, accessToken, refreshToken }
  }
}
