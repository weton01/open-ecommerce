import { Account, AccountError } from '@/entities/account'
import { SaveAccountRepository, FindByEmailAccountRepository } from '@/use-cases/common/contracts/repositories'
import { AccountAuthenticationDTO } from '@/use-cases/active-account/active-account.dtos'
import { AuthFacebookAPI, AuthGoogleAPI } from '@/use-cases/common/contracts/apis'
import { Encrypter } from '@/use-cases/common/contracts/packages'
import { AccountDTO } from '@/use-cases/create-account/create-account.dtos'
import { AuthSocialDTO } from './auth-social.dtos'

export class AuthSocial {
  constructor (
    private readonly accRepository: SaveAccountRepository & FindByEmailAccountRepository,
    private readonly facebook: AuthFacebookAPI,
    private readonly google: AuthGoogleAPI,
    private readonly accessEncrypter: Encrypter,
    private readonly refreshEncrypter: Encrypter
  ) {}

  private async accountBuilder (acc: AccountDTO): Promise<AccountAuthenticationDTO> {
    const account = Account.build(acc)
    const accessToken = this.accessEncrypter.encrypt({ id: account.id })
    const refreshToken = this.refreshEncrypter.encrypt({ id: account.id })
    const response = await this.accRepository.save(account)
    return { account: response, accessToken, refreshToken }
  }

  async execute (dto: AuthSocialDTO): Promise<AccountAuthenticationDTO> {
    let isValid: AccountDTO | undefined
    if (dto.type === 'facebook') { isValid = await this.facebook.authFacebook(dto.token) }
    if (dto.type === 'google') { isValid = await this.google.authGoogle(dto.token) }
    if (isValid === undefined) { throw new AccountError(['Invalid Token'], 504) }
    const exists = await this.accRepository.findByEmail(isValid.email)
    if (exists !== undefined) { return this.accountBuilder(exists) }
    return this.accountBuilder(isValid)
  }
}
