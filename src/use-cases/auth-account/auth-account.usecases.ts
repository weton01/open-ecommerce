import { AccountError } from '@/entities/account'
import { AccountAuthenticationDTO } from '@/use-cases/active-account/active-account.dtos'
import { Comparator, Encrypter } from '@/use-cases/common/packages'
import { FindByEmailAccountRepository } from '@/use-cases/common/repositories'
import { AuthAccountDTO } from './auth-account.dtos'

export class AuthAccount {
  constructor (
    private readonly accRepository: FindByEmailAccountRepository,
    private readonly accessEncrypter: Encrypter,
    private readonly refreshEncrypter: Encrypter,
    private readonly comparator: Comparator
  ) { }

  async execute (dto: AuthAccountDTO): Promise<AccountAuthenticationDTO> {
    const exists = await this.accRepository.findByEmail(dto.email)
    if (exists == null) { throw new AccountError(['Account not found'], 404) }
    if (!exists.active) { throw new AccountError(['Account not is active'], 504) }
    const isValisPassword = await this.comparator.compare(dto.password, exists.password!)
    if (!isValisPassword) { throw new AccountError(['Invalid Credentials'], 400) }
    const accessToken = this.accessEncrypter.encrypt({ id: exists.id })
    const refreshToken = this.refreshEncrypter.encrypt({ id: exists.id })
    return { account: exists, accessToken, refreshToken }
  }
}
