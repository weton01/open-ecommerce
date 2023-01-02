import { AccountDTO } from '@/use-cases/create-account/create-account.dtos'

export interface FindByIdAccountRepository {
  findById: (id: string) => Promise<AccountDTO | undefined>
}
