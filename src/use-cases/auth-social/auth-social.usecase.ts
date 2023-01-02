import { Account } from '@/entities/account'
import { SaveAccountRepository, FindByEmailAccountRepository } from '@/use-cases/common/repositories'
import { AccountAuthenticationDTO } from '@/use-cases/active-account/active-account.dtos'
import { AuthFacebookAPI, AuthGoogleAPI, AuthSocialOutputDTO } from '@/use-cases/common/apis'
import { Configuration, Encrypter } from '@/use-cases/common/packages'
import { AuthSocialDTO } from './auth-social.dtos'
import { BadRequestError } from '@/use-cases/common/errors'

export class AuthSocial {
  constructor (
    private readonly accRepository: SaveAccountRepository & FindByEmailAccountRepository,
    private readonly facebook: AuthFacebookAPI,
    private readonly google: AuthGoogleAPI,
    private readonly accessEncrypter: Encrypter,
    private readonly refreshEncrypter: Encrypter,
    private readonly config: Configuration
  ) {}

  private async accountBuilder (acc: AuthSocialOutputDTO & { id: string, image: string }): Promise<AccountAuthenticationDTO> {
    const account = Account.build(acc)
    const response = await this.accRepository.save(account)
    const accessToken = this.accessEncrypter.encrypt({ id: response.id })
    const refreshToken = this.refreshEncrypter.encrypt({ id: response.id })
    return { account: response, accessToken, refreshToken }
  }

  async execute (dto: AuthSocialDTO): Promise<AccountAuthenticationDTO> {
    let isValid: AuthSocialOutputDTO | undefined
    if (dto.type === 'facebook') { isValid = await this.facebook.authFacebook(dto.token) }
    if (dto.type === 'google') { isValid = await this.google.authGoogle(dto.token) }
    if (isValid === undefined) { throw new BadRequestError('Invalid Token') }
    const exists = await this.accRepository.findByEmail(isValid.email)
    if (exists !== undefined) { return await this.accountBuilder(exists) }
    return await this.accountBuilder({ ...isValid, image: this.config.defaultProfileImage })
  }
}
