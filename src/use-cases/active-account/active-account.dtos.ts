import { AccountDTO } from '@/use-cases/create-account/create-account.dtos'

export interface ActiveAccountDTO {
  email: string
  activationCode: string
}

export interface AccountAuthenticationDTO {
  accessToken: string
  refreshToken: string
  account: AccountDTO
}
