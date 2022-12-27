import { Account } from '@/entities/account'
import { Configuration, DeleteFile, UniqueIdGenerator, UploadFile } from '@/use-cases/common/packages'
import { FindByIdAccountRepository, SaveAccountRepository } from '@/use-cases/common/repositories'
import { AccountDTO } from '@/use-cases/create-account/create-account.dtos'
import { NotFoundError } from '@/use-cases/common/errors'
import { FileType, UpdateAccountImageDTO } from './update-account-image.dtos'

export class UpdateAccountImage {
  constructor (
    private readonly accRepository: FindByIdAccountRepository & SaveAccountRepository,
    private readonly fileStorage: UploadFile & DeleteFile,
    private readonly idGenerator: UniqueIdGenerator,
    private readonly config: Configuration
  ) { }

  private async removeImage (acc: AccountDTO): Promise<Account> {
    const oldAcc = Account.build(acc)
    await this.fileStorage.delete(oldAcc.getImage.id)
    const account = Account.build({ ...acc, image: this.config.defaultProfileImage })
    return account
  }

  private async updateImage (acc: AccountDTO, file: FileType): Promise<Account> {
    const oldAcc = Account.build(acc)
    await this.fileStorage.delete(oldAcc.getImage.id)
    const key = this.idGenerator.generate()
    const fileName = `${key}${file?.mimeType}`
    const address = await this.fileStorage.upload(file.buffer, acc.id, fileName)
    const account = Account.build({ ...acc, image: address })
    return account
  }

  private async choose (acc: AccountDTO, file?: FileType): Promise<Account> {
    if (file !== undefined) { return await this.updateImage(acc, file) }
    return await this.removeImage(acc)
  }

  async execute (dto: UpdateAccountImageDTO): Promise<AccountDTO> {
    const exists = await this.accRepository.findById(dto.id)
    if (exists == null) { throw new NotFoundError('Account not found') }
    const account = await this.choose(exists, dto.file)
    const response = await this.accRepository.save(account)
    return response
  }
}
