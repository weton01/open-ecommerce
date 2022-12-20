import { Account, AccountError } from '@/entities/account'
import { Configuration, Encrypter, Notifier } from '@/use-cases/common/contracts/packages'
import { FindByEmailAccountRepository } from '@/use-cases/common/contracts/repositories'
import { RecoverPasswordDTO } from './recover-password.dtos'

export class RecoverPassword {
  constructor (
    private readonly accountRepository: FindByEmailAccountRepository,
    private readonly config: Configuration,
    private readonly encrypter: Encrypter,
    private readonly notifier: Notifier
  ) {}

  async execute (dto: RecoverPasswordDTO): Promise<boolean> {
    const exists = await this.accountRepository.findByEmail(dto.email)
    if (exists == null) { throw new AccountError(['Account not found'], 404) }
    const accessToken = this.encrypter.encrypt({ id: exists.id }, this.config.accessTokenSecret)
    const account = Account.build(exists)
    await this.notifier.notify(account, { accessToken })
    return true
  }
}
