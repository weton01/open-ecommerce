export interface CreateAccountDTO {
  name: string
  email: string
  password: string
  active?: boolean
  image?: string
}

export interface AccountDTO{
  id: string
  name: string
  email: string
  active: boolean
  image: string
  activationCode: string
  password?: string
  createdAt?: string
  updatedAt?: string
}
