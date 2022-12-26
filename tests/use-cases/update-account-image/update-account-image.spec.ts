import { Account, AccountError } from '@/entities/account'
import { mock, MockProxy } from 'jest-mock-extended'
import { Configuration, UploadFile, DeleteFile, UniqueIdGenerator } from '@/use-cases/common/packages'
import { AccountDTO } from '@/use-cases/create-account/create-account.dtos'
import { FindByIdAccountRepository, SaveAccountRepository } from '@/use-cases/common/repositories'
import { UpdateAccountImage } from '@/use-cases//update-account-image/update-account-image.usecase'
import { UpdateAccountImageDTO } from './update-account-image.dtos'

describe('UpdateAccountImage', () => {
  let sut: UpdateAccountImage
  let accountRepo: MockProxy<FindByIdAccountRepository & SaveAccountRepository>
  let idGenerator: MockProxy<UniqueIdGenerator>
  let fileStorage: MockProxy<UploadFile & DeleteFile>
  let config: MockProxy<Configuration>

  const accountProps: UpdateAccountImageDTO = {
    id: 'any_id',
    file: { buffer: Buffer.alloc(1024), mimeType: '.json' }
  }

  const accountDTO: AccountDTO = {
    id: 'any_id',
    email: 'any_email@mail.com',
    name: 'any_name',
    image: 'https://any_image.com/any_id/any_random_id',
    active: false,
    activationCode: '00000',
    createdAt: 'any_date',
    updatedAt: 'any_date'
  }

  beforeAll(() => {
    accountRepo = mock()
    config = mock()
    fileStorage = mock()
    idGenerator = mock()
  })

  beforeEach(() => {
    accountRepo.findById.mockResolvedValue(accountDTO)
    accountRepo.save.mockResolvedValue(accountDTO)
    idGenerator.generate.mockReturnValue('any_random_id')
    fileStorage.upload.mockResolvedValue('https://any_image.com/any_id/any_random_id')
    config.defaultProfileImage = 'https://any_image.com/any_id/any_random_id'
    sut = new UpdateAccountImage(accountRepo, fileStorage, idGenerator, config)
  })

  it('should call IdGenerator 1 times', async () => {
    await sut.execute(accountProps)
    expect(accountRepo.findById).toHaveBeenCalledTimes(1)
  })

  it('should call FindByIdAccountRepo with correct values', async () => {
    await sut.execute(accountProps)
    expect(accountRepo.findById).toHaveBeenCalledWith(accountProps.id)
    expect(accountRepo.findById).toHaveBeenCalledTimes(1)
  })

  it('should throw a AccountError if id not is registered on database', async () => {
    accountRepo.findById.mockResolvedValue(undefined as any)
    const promise = sut.execute(accountProps)
    await expect(promise).rejects.toThrow(new AccountError([]))
  })

  it('should call Filestorage Delete with correct values', async () => {
    await sut.execute(accountProps)
    expect(fileStorage.delete).toHaveBeenCalledWith('any_random_id')
    expect(fileStorage.delete).toHaveBeenCalledTimes(1)
  })

  it('should call Id Generator', async () => {
    await sut.execute(accountProps)
    expect(idGenerator.generate).toHaveBeenCalledTimes(1)
  })

  it('should call Filestorage Update with correct values', async () => {
    await sut.execute(accountProps)
    const fileName = 'any_random_id.json'
    expect(fileStorage.upload).toHaveBeenCalledWith(accountProps.file?.buffer, accountProps.id, fileName)
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('should choose the correct way when the file not is sended', async () => {
    await sut.execute({ ...accountProps, file: undefined })
    expect(fileStorage.delete).toHaveBeenCalledTimes(1)
    expect(fileStorage.upload).toHaveBeenCalledTimes(0)
  })

  it('should choose the correct way when the file is sended', async () => {
    await sut.execute(accountProps)
    expect(fileStorage.delete).toHaveBeenCalledTimes(1)
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('should call accRepository save with correct values', async () => {
    await sut.execute(accountProps)
    const account = Account.build(accountDTO)
    expect(accountRepo.save).toHaveBeenCalledWith(account)
    expect(accountRepo.save).toHaveBeenCalledTimes(1)
  })
})
