import { mock, MockProxy } from 'jest-mock-extended'
import { Hasher } from '@/use-cases/common/packages'
import { AccountDTO } from '@/use-cases/create-account/create-account.dtos'
import { FindByEmailAccountRepository, SaveAccountRepository } from '@/use-cases/common/repositories'
import { Account } from '@/entities/account'
import { RecoverPasswordCallback } from '@/use-cases/recover-password-cb/recover-password-cb.usecase'
import { RecoverPasswordCbDTO } from '@/use-cases/recover-password-cb/recover-password-cb.dtos'
import { NotFoundError } from '@/use-cases/common/errors'

describe('RecoverPasswordCallback', () => {
  let sut: RecoverPasswordCallback
  let hasher: MockProxy<Hasher>
  let accountRepo: MockProxy<FindByEmailAccountRepository & SaveAccountRepository>

  const accountPropsDTO: RecoverPasswordCbDTO = {
    email: 'any_email@mail.com',
    password: 'any_password'
  }

  const accountProps: AccountDTO = {
    id: 'any_id',
    email: 'any_email@mail.com',
    name: 'any_name',
    image: 'https://any_image.com',
    active: false,
    password: 'any_password',
    activationCode: '00000',
    createdAt: 'any_date',
    updatedAt: 'any_date'
  }

  beforeAll(() => {
    accountRepo = mock()
    hasher = mock()
  })

  beforeEach(() => {
    accountRepo.findByEmail.mockResolvedValue(accountProps)
    accountRepo.save.mockResolvedValue(accountProps)
    sut = new RecoverPasswordCallback(accountRepo, hasher)
  })

  it('should RecoverPasswordCallback try with success', async () => {
    const response = await sut.execute(accountPropsDTO)
    expect(response).toBe(true)
  })

  it('should call FindByEmailRepo with correct values', async () => {
    await sut.execute(accountPropsDTO)
    expect(accountRepo.findByEmail).toHaveBeenCalledWith(accountPropsDTO.email)
    expect(accountRepo.findByEmail).toHaveBeenCalledTimes(1)
  })

  it('should call FindByEmailRepo with invalid e-mail', async () => {
    accountRepo.findByEmail.mockResolvedValue(undefined)
    const promise = sut.execute(accountPropsDTO)
    await expect(promise).rejects.toThrow(new NotFoundError('Account not found'))
  })

  it('should rethrow if FindByEmail throws', async () => {
    accountRepo.findByEmail.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut.execute(accountPropsDTO)
    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('should call Hasher with correct values', async () => {
    await sut.execute(accountPropsDTO)
    expect(hasher.hash).toHaveBeenCalledWith(accountProps.password)
    expect(hasher.hash).toHaveBeenCalledTimes(1)
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
})
