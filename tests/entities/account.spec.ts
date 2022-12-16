import { Account, AccountError, AccountProps } from '@/entities/account'

describe('Account', () => {
  it('Should success creating Account Entity', () => {
    const accountProps: AccountProps = {
      id: 'any_id',
      name: 'any_name',
      email: 'valid_mail@mail.com',
      password: 'any_password'
    }
    const account = Account.build(accountProps)

    expect(account.id).toBe(accountProps.id)
    expect(account.name).toBe(accountProps.name)
    expect(account.email).toBe(accountProps.email)
    expect(account.password).toBe(accountProps.password)
  })

  it('Should fail when give an invalida e-mail', () => {
    const accountProps: AccountProps = {
      id: 'any_id',
      name: 'any_name',
      email: 'invalid_mail@mail..com',
      password: 'any_password'
    }

    expect(() => { Account.build(accountProps) }).toThrow(new AccountError(['Invalid e-mail']))
  })
})
