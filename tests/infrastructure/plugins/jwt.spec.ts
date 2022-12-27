import { JwtTokenHandler } from '@/infrastructure/plugins'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')
describe('JwtTokenHandler', () => {
  let sut: JwtTokenHandler
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string
  let key: string
  let token: string
  let expiration: number

  beforeAll(() => {
    key = 'any_key'
    token = 'any_token'
    expiration = 100
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => token)
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(secret, 100)
  })

  it('should call jwt sign with correct values', () => {
    sut.encrypt({ id: key })
    expect(fakeJwt.sign).toHaveBeenCalledWith({ id: key }, secret, { expiresIn: expiration })
    expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
  })

  it('should return a token', async () => {
    const generatedToken = sut.encrypt({ id: key })
    expect(generatedToken).toBe(token)
  })

  it('should rethrow if sign throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') })
    expect(() => { sut.encrypt({ id: key }) }).toThrow(new Error('token_error'))
  })
})
