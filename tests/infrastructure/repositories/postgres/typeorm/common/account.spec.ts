
import { IBackup } from 'pg-mem'
import { Repository } from 'typeorm'
import { PgUserAccountRepository } from '@/infrastructure/repositories/postgres/typeorm'
import { PgConnection } from '@/infrastructure/repositories/postgres/typeorm/common/connection'
import { PgRepository } from '@/infrastructure/repositories/postgres/typeorm/common/repository'
import { PgUser } from '@/infrastructure/repositories/postgres/typeorm/common/entities/user'
import { makeFakeDb } from './mocks/connection'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let connection: PgConnection
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup
  const saveUser = {
    email: 'any_email@mail.com',
    name: 'any_name',
    password: 'any_password',
    image: 'any_image',
    active: false,
    activationCode: '111111'
  }

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDb([PgUser])
    backup = db.backup()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  beforeEach(() => {
    backup.restore()
    pgUserRepo = connection.getRepository(PgUser)
    sut = new PgUserAccountRepository()
  })

  it('should extend PgRepository', async () => {
    expect(sut).toBeInstanceOf(PgRepository)
  })

  describe('findByEmail', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepo.save(saveUser)
      const account = await sut.findByEmail('any_email@mail.com')
      expect(account?.email).toEqual('any_email@mail.com')
    })

    it('should return undefined if email does not exists', async () => {
      const account = await sut.findByEmail('any_email@mail.com')
      expect(account).toEqual(undefined)
    })
  })

  describe('findById', () => {
    it('should return an account if id exists', async () => {
      const acc = await pgUserRepo.save(saveUser)
      const account = await sut.findById(acc.id)
      expect(account?.email).toEqual('any_email@mail.com')
    })

    it('should return undefined if id does not exists', async () => {
      const account = await sut.findById('c423603c-8ae3-11ed-a1eb-0242ac120002')
      expect(account).toEqual(undefined)
    })
  })

  describe('save', () => {
    it('should create a account if id not exists', async () => {
      const { id } = await sut.save(saveUser)

      const pgUser = await pgUserRepo.findOne({ email: saveUser.email })

      expect(id).toBe('b5fb62ad-e2b0-4ce9-b7c0-2aa3ea050562')
      expect(pgUser?.id).toBe('b5fb62ad-e2b0-4ce9-b7c0-2aa3ea050562')
    })

    it('should update an account if id not exists', async () => {
      await pgUserRepo.save(saveUser)
      await sut.save({ ...saveUser, active: true })

      const account = await sut.findByEmail(saveUser.email)
      expect(account).toMatchObject({
        id: 'b5fb62ad-e2b0-4ce9-b7c0-2aa3ea050562',
        email: 'any_email@mail.com',
        name: 'any_name'
      })
    })
  })
})
