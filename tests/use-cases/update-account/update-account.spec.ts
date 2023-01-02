import { Account } from '@/entities/account'
import { mock, MockProxy } from 'jest-mock-extended'
import { Hasher } from '@/use-cases/common/packages'
import { AccountDTO } from '@/use-cases/create-account/create-account.dtos'
import { FindByIdAccountRepository, SaveAccountRepository } from '@/use-cases/common/repositories'
import { UpdateAccountDTO } from '@/use-cases/update-account/update-account.dtos'
import { UpdateAccount } from '@/use-cases/update-account/update-account.usecases'
import { NotFoundError } from '@/use-cases/common/errors'

describe('UpdateAccount', () => {
  let sut: UpdateAccount
  let accountRepo: MockProxy<FindByIdAccountRepository & SaveAccountRepository>
  let hasher: MockProxy<Hasher>

  const accountProps: UpdateAccountDTO = {
    id: 'any_id',
    name: 'any_name',
    password: 'any_password'
  }

  const accountDTO: AccountDTO = {
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
    accountRepo.findById.mockResolvedValue(accountDTO)
    accountRepo.save.mockResolvedValue(accountDTO)
    hasher = mock()
  })

  beforeEach(() => {
    accountRepo.findById.mockResolvedValue(accountDTO)
    sut = new UpdateAccount(accountRepo, hasher)
  })

  it('should call FindByIdAccountRepo with correct values', async () => {
    await sut.execute(accountProps)
    expect(accountRepo.findById).toHaveBeenCalledWith(accountProps.id)
    expect(accountRepo.findById).toHaveBeenCalledTimes(1)
  })

  it('should throw a AccountError if id not is registered on database', async () => {
    accountRepo.findById.mockResolvedValue(undefined as any)
    const promise = sut.execute(accountProps)
    await expect(promise).rejects.toThrow(new NotFoundError('Account not found'))
  })

  it('should call Hasher with correct values', async () => {
    await sut.execute(accountProps)
    expect(hasher.hash).toHaveBeenCalledWith(accountProps.password)
    expect(hasher.hash).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if SaveAccount throws', async () => {
    accountRepo.save.mockRejectedValueOnce(new Error('Failed while manipulating Image entity'))

    const promise = sut.execute(accountProps)

    await expect(promise).rejects.toThrow(new Error('Failed while manipulating Image entity'))
  })

  it('should call SaveAccountRepository with correct values', async () => {
    hasher.hash.mockResolvedValue('any_hash')

    await sut.execute(accountProps)

    const account = Account.build({
      email: 'any_email@mail.com',
      name: 'any_name',
      password: 'any_hash',
      image: 'https://any_image.com',
      active: false,
      id: 'any_id',
      activationCode: ''
    })

    expect(accountRepo.save).toHaveBeenCalledWith(account)
    expect(accountRepo.save).toHaveBeenCalledTimes(1)
  })
})
