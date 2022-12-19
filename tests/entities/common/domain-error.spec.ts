import { DomainError } from '@/entities/common/domain-error'

describe('DomainError', () => {
  it('should throw a correct values', () => {
    const error = new DomainError('Test', 'test')

    expect(error.errors[0]).toBe('test')
  })

  it('should throw a error array', () => {
    const error = new DomainError('Test', ['test'])

    expect(error.errors[0]).toBe('test')
  })

  it('should throw a error with correct status code if is provided', () => {
    const error = new DomainError('Test', ['test'], 400)

    expect(error.statusCode).toBe(400)
  })

  it('should throw a error with correct status code if not is provided', () => {
    const error = new DomainError('Test', ['test'])

    expect(error.statusCode).toBe(500)
  })
})
