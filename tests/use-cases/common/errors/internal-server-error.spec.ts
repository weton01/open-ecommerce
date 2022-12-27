import { InternalServerError } from '@/use-cases/common/errors'

describe('InternalServerError', () => {
  it('should return internal server error with status code 500', () => {
    const sut = new InternalServerError()
    expect(sut.code).toBe(500)
    expect(sut.name).toBe('InternalServerError')
    expect(sut.message).toBe('Internal Server Error')
  })
})
