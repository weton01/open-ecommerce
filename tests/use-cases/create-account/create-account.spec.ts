import { Account, AccountError } from '@/entities/account'
import { mock, MockProxy } from 'jest-mock-extended'
import { Notifier, Hasher, Configuration } from '@/use-cases/common/contracts/packages'
import { CreateAccountDTO } from '@/use-cases/create-account/create-account.dtos'
import { CreateAccount } from '@/use-cases/create-account/create-account.usecase'
import { FindByEmailAccountRepository, SaveAccountRepository } from '@/use-cases/common/contracts/repositories'

describe('CreateAccount', () => {
  let sut: CreateAccount
  let accountRepo: MockProxy<SaveAccountRepository & FindByEmailAccountRepository>
  let hasher: MockProxy<Hasher>
  let configuration: MockProxy<Configuration>

  let notifier: MockProxy<Notifier>
  const accountProps: CreateAccountDTO = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }

  beforeAll(() => {
    accountRepo = mock()
    accountRepo.save.mockResolvedValue({
      id: 'any_id',
      email: 'any_email@mail.com',
      name: 'any_name',
      createdAt: 'any_date',
      updatedAt: 'any_date'
    })
    hasher = mock()
    notifier = mock()
    configuration = mock()
  })

  beforeEach(() => {
    sut = new CreateAccount(accountRepo, accountRepo, configuration, notifier, hasher)
  })

  it('should call FindByEmailRepo with correct values', async () => {
    await sut.execute(accountProps)
    expect(accountRepo.findByEmail).toHaveBeenCalledWith(accountProps.email)
    expect(accountRepo.findByEmail).toHaveBeenCalledTimes(1)
  })

  it('should throw a AccountError if email already registered on database', async () => {
    accountRepo.findByEmail.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      createdAt: 'any_date',
      updatedAt: 'any_date'
    })

    const promise = sut.execute(accountProps)

    await expect(promise).rejects.toThrow(new AccountError([]))
  })

  it('should call FindByEmailRepo with correct values', async () => {
    await sut.execute(accountProps)
    expect(hasher.hash).toHaveBeenCalledWith(accountProps.password)
    expect(hasher.hash).toHaveBeenCalledTimes(1)
  })

  it('should call Hasher with correct values', async () => {
    await sut.execute(accountProps)
    expect(hasher.hash).toHaveBeenCalledWith(accountProps.password)
    expect(hasher.hash).toHaveBeenCalledTimes(1)
  })

  it('should call Notifier with correct values', async () => {
    hasher.hash.mockResolvedValue('any_hash')
    configuration.defaultProfileImage = 'any_value'

    await sut.execute(accountProps)

    const account = new Account({
      email: 'any_email@mail.com',
      name: 'any_name',
      password: 'any_hash',
      image: 'any_value'
    })

    expect(notifier.notify).toHaveBeenCalledWith(account)
    expect(notifier.notify).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if SaveAccount throws', async () => {
    accountRepo.save.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut.execute(accountProps)

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })
})
