import { mock, MockProxy } from 'jest-mock-extended'
import { Configuration, Encrypter, Comparator } from '@/use-cases/common/contracts/packages'
import { FindByEmailAccountRepository } from '@/use-cases/common/contracts/repositories'
import { AccountError } from '@/entities/account'
import { AccountDTO } from '@/use-cases/create-account/create-account.dtos'
import { AuthAccountDTO } from '@/use-cases/auth-account/auth-account.dtos'
import { AuthAccount } from '@/use-cases/auth-account/auth-account.usecases'

describe('AuthAccount', () => {
  let sut: AuthAccount
  let accountRepo: MockProxy<FindByEmailAccountRepository>
  let comparator: MockProxy<Comparator>
  let configuration: MockProxy<Configuration>
  let encrypter: MockProxy<Encrypter>

  const accountPropsDTO: AuthAccountDTO = {
    email: 'any_email@mail.com',
    password: 'any_password'
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
    comparator = mock()
    encrypter = mock()
    configuration = mock()
    configuration.defaultProfileImage = 'any_value'
  })

  beforeEach(() => {
    comparator.compare.mockResolvedValue(true)
    accountRepo.findByEmail.mockResolvedValue(accountProps)
    sut = new AuthAccount(accountRepo, configuration, encrypter, comparator)
  })

  it('should call findUserByEmail with correct values', async () => {
    await sut.execute(accountPropsDTO)
    expect(accountRepo.findByEmail).toHaveBeenCalledWith(accountProps.email)
    expect(accountRepo.findByEmail).toHaveBeenCalledTimes(1)
  })

  it('should throws when call findUserByEmail with email that not exists in database', async () => {
    accountRepo.findByEmail.mockReturnValue(undefined as any)
    const promise = sut.execute(accountPropsDTO)
    await expect(promise).rejects.toThrow(new AccountError([]))
  })

  it('should call compare with correct values', async () => {
    await sut.execute(accountPropsDTO)
    expect(comparator.compare).toHaveBeenCalledWith(accountPropsDTO.password, accountProps.password)
    expect(comparator.compare).toHaveBeenCalledTimes(1)
  })

  it('should throw when call compare with invalid password', async () => {
    comparator.compare.mockReturnValue(new Promise(resolve => resolve(false)))
    const promise = sut.execute(accountPropsDTO)
    await expect(promise).rejects.toThrow(new AccountError([]))
    expect(comparator.compare).toHaveBeenCalledTimes(1)
  })

  it('should throw if account not is active', async () => {
    accountRepo.findByEmail.mockResolvedValue({ ...accountProps, active: false })
    const promise = sut.execute(accountPropsDTO)
    await expect(promise).rejects.toThrow(new AccountError([]))
  })

  it('should call Encrypter with correct values', async () => {
    await sut.execute(accountPropsDTO)
    expect(encrypter.encrypt).toHaveBeenCalledWith({ id: 'any_id' }, configuration.accessTokenSecret)
    expect(encrypter.encrypt).toHaveBeenCalledWith({ id: 'any_id' }, configuration.refreshTokenSecret)
    expect(encrypter.encrypt).toHaveBeenCalledTimes(2)
  })
})
