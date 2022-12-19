import { Entity, EntityError } from '@/entities/common/entity'

export interface AccountProps {
  id?: string
  name: string
  email: string
  password: string
  image: string
}

export class AccountError extends EntityError {
  constructor (errors: string[], statusCode?: number) {
    super('Account', errors, statusCode)
  }
}

export class Account extends Entity<AccountProps> {
  get id (): string {
    if (this.props.id !== null && this.props.id !== undefined) { return this.props.id }
    return ''
  }

  get name (): string {
    return this.props.name
  }

  get email (): string {
    return this.props.email
  }

  get password (): string {
    return this.props.password
  }

  get image (): string {
    return this.props.image
  }

  static build (props: AccountProps): Account {
    const errors: string[] = []
    props.email = props.email.toLowerCase()
    if (!/^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/.test(props.email)) { errors.push('Invalid e-mail') }
    if (errors.length > 0) { throw new AccountError(errors) }
    return new Account(props)
  }
}
