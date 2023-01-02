import { Entity, EntityError } from '@/entities/common/entity'
import { Image } from './image'

export interface AccountProps {
  id?: string
  name: string
  email: string
  password?: string
  image: Image
  active: boolean
  activationCode: string
}

interface BuildAccountProps {
  id?: string
  name: string
  email: string
  password?: string
  image: string
  active: boolean
  activationCode?: string
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
    if (this.props.password !== null && this.props.password !== undefined) { return this.props.password }
    return ''
  }

  get image (): string {
    return this.props.image.address
  }

  get getImage (): Image {
    return this.props.image
  }

  get active (): boolean {
    return this.props.active
  }

  get activationCode (): string {
    return this.props.activationCode
  }

  changePassword (pswd?: string): void {
    if (pswd !== null && pswd !== undefined && pswd !== '') {
      this.props.password = pswd
    }
  }

  static build (props: BuildAccountProps): Account {
    const errors: string[] = []
    props.email = props.email.toLowerCase()
    const image = Image.build({ url: props.image })
    if (!/^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/.test(props.email)) { errors.push('Invalid e-mail') }
    if (errors.length > 0) { throw new AccountError(errors) }
    return new Account({
      id: props.id,
      activationCode: '',
      name: props.name,
      email: props.email,
      password: props.password,
      image,
      active: props.active
    })
  }
}
