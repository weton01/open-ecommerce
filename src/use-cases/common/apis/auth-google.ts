import { AccountDTO } from '@/use-cases/create-account/create-account.dtos'

export interface AuthGoogleAPI {
  authGoogle: (accessToken: string) => Promise<AccountDTO | undefined>
}
