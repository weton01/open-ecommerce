import { mock, MockProxy } from 'jest-mock-extended'
import { Encrypter, Notifier } from '@/use-cases/common/contracts/packages'
import { AccountDTO } from '@/use-cases/create-account/create-account.dtos'
import { FindByEmailAccountRepository } from '@/use-cases/common/contracts/repositories'
import { Account, AccountError } from '@/entities/account'
import { RecoverPassword } from '@/use-cases/recover-password/recover-password.usecase'
import { RecoverPasswordDTO } from '@/use-cases/recover-password/recover-password.dtos'

describe('RecoverPassword', () => {
  let sut: RecoverPassword
  let accountRepo: MockProxy<FindByEmailAccountRepository >
  let encrypter: MockProxy<Encrypter>
  let notifier: MockProxy<Notifier>

  const accountPropsDTO: RecoverPasswordDTO = {
    email: 'any_email@mail.com'
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
  })

  beforeEach(() => {
    accountRepo.findByEmail.mockResolvedValue(accountProps)
    sut = new RecoverPassword(accountRepo, encrypter, notifier)
  })

  it('should RecoverPassword try with success', async () => {
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
    await expect(promise).rejects.toThrow(new AccountError([]))
  })

  it('should call Encrypter with correct values', async () => {
    await sut.execute(accountPropsDTO)
    expect(encrypter.encrypt).toHaveBeenCalledWith({ id: 'any_id' })
    expect(encrypter.encrypt).toHaveBeenCalledTimes(1)
  })

  it('should call Notifier with correct values', async () => {
    encrypter.encrypt.mockReturnValue('any_token')

    await sut.execute(accountPropsDTO)

    const account = new Account({
      id: 'any_id',
      email: 'any_email@mail.com',
      name: 'any_name',
      password: undefined,
      image: 'any_value',
      active: false
    })

    expect(notifier.notify).toHaveBeenCalledWith(account, { accessToken: 'any_token' })
    expect(notifier.notify).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if FindByEmail throws', async () => {
    accountRepo.findByEmail.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut.execute(accountProps)

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })
})
