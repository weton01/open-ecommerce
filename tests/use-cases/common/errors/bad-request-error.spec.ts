import { BadRequestError } from '@/use-cases/common/errors'

describe('BadRequestError', () => {
  it('should return bad request error with status code 400', () => {
    const sut = new BadRequestError('any_error')
    expect(sut.code).toBe(400)
    expect(sut.name).toBe('BadRequestError')
    expect(sut.message).toBe('any_error')
  })
})
