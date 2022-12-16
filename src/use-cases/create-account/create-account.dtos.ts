export interface CreateAccountDTO {
  name: string
  email: string
  password: string
}

export interface AccountDTO{
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}
