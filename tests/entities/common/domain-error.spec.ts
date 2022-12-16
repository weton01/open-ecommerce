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
})
