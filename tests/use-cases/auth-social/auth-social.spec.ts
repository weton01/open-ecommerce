import { mock, MockProxy } from 'jest-mock-extended'
import { Configuration, Encrypter } from '@/use-cases/common/contracts/packages'
import { FindByEmailAccountRepository, SaveAccountRepository } from '@/use-cases/common/contracts/repositories'
import { AccountDTO } from '@/use-cases/create-account/create-account.dtos'
import { AuthSocial } from '@/use-cases/auth-social/auth-social.usecase'
import { AuthFacebookAPI, AuthGoogleAPI } from '@/use-cases/common/contracts/apis'
import { AuthSocialDTO } from '@/use-cases/auth-social/auth-social.dtos'
import { AccountError } from '@/entities/account'

describe('AuthSocial', () => {
  let sut: AuthSocial
  let accountRepo: MockProxy<SaveAccountRepository & FindByEmailAccountRepository>
  let configuration: MockProxy<Configuration>
  let encrypter: MockProxy<Encrypter>
  let facebook: MockProxy<AuthFacebookAPI>
  let google: MockProxy<AuthGoogleAPI>

  const accountPropsDTO: AuthSocialDTO = {
    token: 'any_token',
    type: 'facebook'
  }

  const accountProps: AccountDTO = {
    id: 'any_id',
    email: 'any_email@mail.com',
    name: 'any_name',
    image: 'any_value',
    active: true,
    activationCode: '00000',
    createdAt: 'any_date',
    updatedAt: 'any_date',
    password: 'any_password'
  }

  beforeAll(() => {
    accountRepo = mock()
    encrypter = mock()
    configuration = mock()
    facebook = mock()
    google = mock()
    configuration.defaultProfileImage = 'any_value'
  })

  beforeEach(() => {
    facebook.authFacebook.mockResolvedValue(accountProps)
    google.authGoogle.mockResolvedValue(accountProps)
    accountRepo.save.mockResolvedValue(accountProps)
    sut = new AuthSocial(accountRepo, facebook, google, encrypter, encrypter)
  })

  it('should call AuthFacebook with correct values', async () => {
    await sut.execute(accountPropsDTO)
    expect(facebook.authFacebook).toHaveBeenCalledWith(accountPropsDTO.token)
    expect(facebook.authFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call AuthFacebook if type of dto is facebook', async () => {
    await sut.execute({ ...accountPropsDTO, type: 'facebook' })
    expect(facebook.authFacebook).toHaveBeenCalledWith(accountPropsDTO.token)
    expect(facebook.authFacebook).toHaveBeenCalledTimes(1)
    expect(google.authGoogle).toHaveBeenCalledTimes(0)
  })

  it('should call AuthGoogle if type of dto is google', async () => {
    await sut.execute({ ...accountPropsDTO, type: 'google' })
    expect(google.authGoogle).toHaveBeenCalledWith(accountPropsDTO.token)
    expect(google.authGoogle).toHaveBeenCalledTimes(1)
    expect(facebook.authFacebook).toHaveBeenCalledTimes(0)
  })

  it('should call Encrypter with correct values', async () => {
    await sut.execute(accountPropsDTO)
    expect(encrypter.encrypt).toHaveBeenCalledWith({ id: 'any_id' })
    expect(encrypter.encrypt).toHaveBeenCalledTimes(2)
  })

  it('should call authFacebook with correct values', async () => {
    facebook.authFacebook.mockReturnValue({ accountProps, email: 'mail@test.com' } as any)
    await sut.execute(accountPropsDTO)
    expect(accountRepo.findByEmail).toHaveBeenCalledWith('mail@test.com')
    expect(accountRepo.findByEmail).toHaveBeenCalledTimes(1)
  })

  it('should call AccountBuild  with correct values if account already exists', async () => {
    accountRepo.findByEmail.mockReturnValue({ ...accountProps, id: 'any_id_1' } as any)
    await sut.execute(accountPropsDTO)
    expect(encrypter.encrypt).toHaveBeenCalledWith({ id: 'any_id_1' })
    expect(accountRepo.findByEmail).toHaveBeenCalledTimes(1)
  })

  it('should call AccountBuild  with correct values if account not exists', async () => {
    accountRepo.findByEmail.mockReturnValue(undefined as any)
    facebook.authFacebook.mockReturnValue({ ...accountProps, id: 'any_id_2' } as any)
    await sut.execute(accountPropsDTO)
    expect(encrypter.encrypt).toHaveBeenCalledWith({ id: 'any_id_2' })
    expect(accountRepo.findByEmail).toHaveBeenCalledTimes(1)
  })

  it('should throw if token is invalid', async () => {
    facebook.authFacebook.mockResolvedValue(undefined as any)
    const promise = sut.execute(accountPropsDTO)
    await expect(promise).rejects.toThrow(new AccountError([]))
  })
})
