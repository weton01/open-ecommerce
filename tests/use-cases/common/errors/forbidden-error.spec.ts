import { ForbiddenError } from '@/use-cases/common/errors'

describe('ForbiddenError', () => {
  it('should return forbiden error with status code 403', () => {
    const sut = new ForbiddenError('any_error')
    expect(sut.code).toBe(403)
    expect(sut.name).toBe('ForbiddenError')
    expect(sut.message).toBe('any_error')
  })
})
