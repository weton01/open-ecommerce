import { AccountDTO } from '@/use-cases/create-account/create-account.dtos'

export interface FindByEmailAccountRepository {
  findByEmail: (email: string) => Promise<AccountDTO | undefined>
}
