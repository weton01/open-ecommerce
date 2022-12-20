import { Account, AccountError, AccountProps } from '@/entities/account'

describe('Account', () => {
  it('should success creating Account Entity', () => {
    const accountProps: AccountProps = {
      id: 'any_id',
      name: 'any_name',
      email: 'valid_mail@mail.com',
      password: 'any_password',
      image: '',
      active: false
    }
    const account = Account.build(accountProps)

    expect(account.id).toBe(accountProps.id)
    expect(account.name).toBe(accountProps.name)
    expect(account.email).toBe(accountProps.email)
    expect(account.password).toBe(accountProps.password)
    expect(account.image).toBe(accountProps.image)
    expect(account.active).toBe(accountProps.active)
  })

  it('should fail when give an invalida e-mail', () => {
    const accountProps: AccountProps = {
      id: 'any_id',
      name: 'any_name',
      email: 'invalid_mail@mail..com',
      password: 'any_password',
      image: '',
      active: false
    }

    expect(() => { Account.build(accountProps) }).toThrow(new AccountError(['Invalid e-mail']))
  })

  it('should id return empty string if provided id is null', () => {
    const accountProps: any = {
      name: 'any_name',
      email: 'valid_mail@mail.com',
      password: 'any_password'
    }
    const account = Account.build(accountProps)

    expect(account.id).toBe('')
  })

  it('should id return empty string if provided password is null', () => {
    const accountProps: any = {
      id: 'asdsa',
      name: 'any_name',
      email: 'valid_mail@mail.com'
    }
    const account = Account.build(accountProps)

    expect(account.password).toBe('')
  })
})
