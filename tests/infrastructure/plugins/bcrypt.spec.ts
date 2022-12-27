import { BcryptHandler } from '@/infrastructure/plugins'
import bcryptjs from 'bcryptjs'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('bcryptjs', () => ({
  async hash (): Promise<string> {
    return 'hash'
  },

  async compare (): Promise<boolean> {
    return true
  }
}))

describe('BcryptAdapter', () => {
  let sut: BcryptHandler
  let fakeBcrypt: MockProxy<typeof bcryptjs>
  let key: string
  let hash: string
  let salts: number

  describe('hash', () => {
    beforeAll(() => {
      key = 'any_key'
      hash = 'any_hash'
      salts = 12
      fakeBcrypt = mock()
    })

    beforeEach(() => {
      fakeBcrypt.hash.mockImplementationOnce(() => hash)
      sut = new BcryptHandler(salts)
    })

    it('should call jwt sign with correct values', async () => {
      await sut.hash(key)
      const hashSpy = jest.spyOn(bcryptjs, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salts)
    })

    it('should return a hash', async () => {
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash')
    })

    it('should rethrow if sign throws', async () => {
      jest.spyOn(bcryptjs, 'hash').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare', () => {
    beforeAll(() => {
      key = 'any_key'
      hash = 'any_hash'
      salts = 100
      fakeBcrypt = mock()
    })

    beforeEach(() => {
      fakeBcrypt.hash.mockImplementationOnce(() => hash)
      sut = new BcryptHandler(salts)
    })

    it('should call jwt sign with correct values', async () => {
      const hashSpy = jest.spyOn(bcryptjs, 'compare')
      await sut.compare(key, 'password_hashed')
      expect(hashSpy).toHaveBeenCalledWith('any_key', 'password_hashed')
    })

    it('should return a hash', async () => {
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash')
    })

    it('should rethrow if sign throws', async () => {
      jest.spyOn(bcryptjs, 'hash').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })
})
