import { NotFoundError } from '@/use-cases/common/errors'

describe('NotFoundError', () => {
  it('should return not found error with status code 404', () => {
    const sut = new NotFoundError('any_error')
    expect(sut.code).toBe(404)
    expect(sut.name).toBe('NotFoundError')
    expect(sut.message).toBe('any_error')
  })
})
