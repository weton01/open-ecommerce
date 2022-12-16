import { AccountDTO, CreateAccountDTO } from '@/use-cases/create-account/create-account.dtos'

export interface SaveAccountRepository {
  save: (account: CreateAccountDTO) => Promise<AccountDTO>
}
