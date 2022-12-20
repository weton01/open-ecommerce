import { Account, AccountError } from '@/entities/account'
import { mock, MockProxy } from 'jest-mock-extended'
import { Configuration, Encrypter, Notifier } from '@/use-cases/common/contracts/packages'
import { AccountDTO } from '@/use-cases/create-account/create-account.dtos'
import { FindByEmailAccountRepository, SaveAccountRepository } from '@/use-cases/common/contracts/repositories'
import { ActiveAccount } from '@/use-cases/active-account/active-account.usecase'
import { ActiveAccountDTO } from '@/use-cases/active-account/active-account.dtos'

describe('CreateAccount', () => {
  let sut: ActiveAccount
  let accountRepo: MockProxy<SaveAccountRepository & FindByEmailAccountRepository >
  let encrypter: MockProxy<Encrypter>
  let notifier: MockProxy<Notifier>
  let configuration: MockProxy<Configuration>

  const accountPropsDTO: ActiveAccountDTO = {
    email: 'any_email@mail.com',
    activationCode: '00000'
  }

  const accountProps: AccountDTO = {
    id: 'any_id',
    email: 'any_email@mail.com',
    name: 'any_name',
    image: 'any_value',
    active: false,
    activationCode: '00000',
    createdAt: 'any_date',
    updatedAt: 'any_date'
  }

  beforeAll(() => {
    accountRepo = mock()
    encrypter = mock()
    notifier = mock()
    configuration = mock()
  })

  beforeEach(() => {
    accountRepo.save.mockResolvedValue(accountProps)
    accountRepo.findByEmail.mockResolvedValue(accountProps)
    sut = new ActiveAccount(accountRepo, configuration, notifier, encrypter)
  })

  it('should call FindByEmailRepo with correct values', async () => {
    await sut.execute(accountPropsDTO)
    expect(accountRepo.findByEmail).toHaveBeenCalledWith(accountPropsDTO.email)
    expect(accountRepo.findByEmail).toHaveBeenCalledTimes(1)
  })

  it('should throws an AccountError if account not exists', async () => {
    accountRepo.findByEmail.mockResolvedValue(null as any)
    const promise = sut.execute(accountPropsDTO)
    await expect(promise).rejects.toThrow(new AccountError(['Account not found'], 404))
  })

  it('should throws an AccountError if account already is active', async () => {
    accountRepo.findByEmail.mockResolvedValue({ ...accountProps, active: true })
    const promise = sut.execute(accountPropsDTO)
    await expect(promise).rejects.toThrow(new AccountError(['Account already active'], 400))
  })

  it('should throws an AccountError if activationCode is false', async () => {
    accountRepo.findByEmail.mockResolvedValue({ ...accountProps, activationCode: '11111' })
    const promise = sut.execute(accountPropsDTO)
    await expect(promise).rejects.toThrow(new AccountError(['Invalid activationCode'], 400))
  })

  it('should call SaveAccountRepo with correct values', async () => {
    await sut.execute(accountPropsDTO)

    const account = new Account({
      id: 'any_id',
      email: 'any_email@mail.com',
      name: 'any_name',
      password: undefined,
      image: 'any_value',
      active: false
    })

    expect(accountRepo.save).toHaveBeenCalledWith(account)
    expect(accountRepo.save).toHaveBeenCalledTimes(1)
  })

  it('should call Notifier with correct values', async () => {
    await sut.execute(accountPropsDTO)

    const account = new Account({
      id: 'any_id',
      email: 'any_email@mail.com',
      name: 'any_name',
      password: undefined,
      image: 'any_value',
      active: false
    })

    expect(notifier.notify).toHaveBeenCalledWith(account)
    expect(notifier.notify).toHaveBeenCalledTimes(1)
  })
})
