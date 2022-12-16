import { Account } from '@/entities/account'

export interface Notifier {
  notify: (account: Account) => Promise<void>
}
