import { AccountDTO } from '@/use-cases/create-account/create-account.dtos'

export interface AuthFacebookAPI {
  authFacebook: (accessToken: string,) => Promise<AccountDTO | undefined>
}
