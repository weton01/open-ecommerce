import { Account } from '@/entities/account'

export interface Notifier {
  notify: (account: Account, content: any) => Promise<void>
}
