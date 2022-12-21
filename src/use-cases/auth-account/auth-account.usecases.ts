import { AccountError } from '@/entities/account'
import { AccountAuthenticationDTO } from '@/use-cases/active-account/active-account.dtos'
import { Comparator, Configuration, Encrypter } from '@/use-cases/common/contracts/packages'
import { FindByEmailAccountRepository } from '@/use-cases/common/contracts/repositories'
import { AuthAccountDTO } from './auth-account.dtos'

export class AuthAccount {
  constructor (
    private readonly accRepository: FindByEmailAccountRepository,
    private readonly config: Configuration,
    private readonly encrypter: Encrypter,
    private readonly comparator: Comparator
  ) { }

  async execute (dto: AuthAccountDTO): Promise<AccountAuthenticationDTO> {
    const exists = await this.accRepository.findByEmail(dto.email)
    if (exists == null) { throw new AccountError(['Account not found'], 404) }
    if (!exists.active) { throw new AccountError(['Account not is active'], 504) }
    const isValisPassword = await this.comparator.compare(dto.password, exists.password!)
    if (!isValisPassword) { throw new AccountError(['Invalid Credentials'], 400) }
    const accessToken = this.encrypter.encrypt({ id: exists.id }, this.config.accessTokenSecret)
    const refreshToken = this.encrypter.encrypt({ id: exists.id }, this.config.refreshTokenSecret)
    return { account: exists, accessToken, refreshToken }
  }
}
