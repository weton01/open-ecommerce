import { ConflictError } from '@/use-cases/common/errors'

describe('ConflictError', () => {
  it('should return conflict error with status code 409', () => {
    const sut = new ConflictError('any_error')
    expect(sut.code).toBe(409)
    expect(sut.name).toBe('ConflictError')
    expect(sut.message).toBe('any_error')
  })
})
