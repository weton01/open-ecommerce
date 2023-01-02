import { Account } from '@/entities/account'
import { mock, MockProxy } from 'jest-mock-extended'
import { Encrypter, Notifier } from '@/use-cases/common/packages'
import { AccountDTO } from '@/use-cases/create-account/create-account.dtos'
import { FindByEmailAccountRepository, SaveAccountRepository } from '@/use-cases/common/repositories'
import { ActiveAccount } from '@/use-cases/active-account/active-account.usecase'
import { ActiveAccountDTO } from '@/use-cases/active-account/active-account.dtos'
import { BadRequestError, ConflictError, NotFoundError } from '@/use-cases/common/errors'

describe('ActiveAccount', () => {
  let sut: ActiveAccount
  let accountRepo: MockProxy<SaveAccountRepository & FindByEmailAccountRepository >
  let encrypter: MockProxy<Encrypter>
  let notifier: MockProxy<Notifier>

  const accountPropsDTO: ActiveAccountDTO = {
    email: 'any_email@mail.com',
    activationCode: '00000'
  }

  const accountProps: AccountDTO = {
    id: 'any_id',
    email: 'any_email@mail.com',
    name: 'any_name',
    image: 'https://any_image.com',
    active: false,
    activationCode: '00000',
    createdAt: 'any_date',
    updatedAt: 'any_date'
  }

  beforeAll(() => {
    accountRepo = mock()
    encrypter = mock()
    notifier = mock()
  })

  beforeEach(() => {
    accountRepo.save.mockResolvedValue(accountProps)
    accountRepo.findByEmail.mockResolvedValue(accountProps)
    sut = new ActiveAccount(accountRepo, notifier, encrypter, encrypter)
  })

  it('should call FindByEmailRepo with correct values', async () => {
    await sut.execute(accountPropsDTO)
    expect(accountRepo.findByEmail).toHaveBeenCalledWith(accountPropsDTO.email)
    expect(accountRepo.findByEmail).toHaveBeenCalledTimes(1)
  })

  it('should throws an AccountError if account not exists', async () => {
    accountRepo.findByEmail.mockResolvedValue(null as any)
    const promise = sut.execute(accountPropsDTO)
    await expect(promise).rejects.toThrow(new NotFoundError('Account not found'))
  })

  it('should throws an AccountError if account already is active', async () => {
    accountRepo.findByEmail.mockResolvedValue({ ...accountProps, active: true })
    const promise = sut.execute(accountPropsDTO)
    await expect(promise).rejects.toThrow(new ConflictError('Account already active'))
  })

  it('should throws an AccountError if activationCode is false', async () => {
    accountRepo.findByEmail.mockResolvedValue({ ...accountProps, activationCode: '11111' })
    const promise = sut.execute(accountPropsDTO)
    await expect(promise).rejects.toThrow(new BadRequestError('Invalid Code'))
  })

  it('should call Encrypter with correct values', async () => {
    await sut.execute(accountPropsDTO)
    expect(encrypter.encrypt).toHaveBeenCalledWith({ id: 'any_id' })
    expect(encrypter.encrypt).toHaveBeenCalledWith({ id: 'any_id' })
    expect(encrypter.encrypt).toHaveBeenCalledTimes(2)
  })

  it('should call SaveAccountRepo with correct values', async () => {
    await sut.execute(accountPropsDTO)

    const account = Account.build({
      id: 'any_id',
      email: 'any_email@mail.com',
      name: 'any_name',
      password: undefined,
      image: 'https://any_image.com',
      active: false,
      activationCode: ''
    })

    expect(accountRepo.save).toHaveBeenCalledWith(account)
    expect(accountRepo.save).toHaveBeenCalledTimes(1)
  })

  it('should call Notifier with correct values', async () => {
    await sut.execute(accountPropsDTO)

    const account = Account.build({
      id: 'any_id',
      email: 'any_email@mail.com',
      name: 'any_name',
      password: undefined,
      image: 'https://any_image.com',
      active: false,
      activationCode: ''
    })

    expect(notifier.notify).toHaveBeenCalledWith(account, {})
    expect(notifier.notify).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if SaveAccount throws', async () => {
    accountRepo.save.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut.execute(accountProps)

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })
})
