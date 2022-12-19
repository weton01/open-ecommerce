export class DomainError extends Error {
  public readonly errors: string[]
  public statusCode: number = 500

  constructor (message: string, errors: string[] | string, statusCode?: number) {
    super()
    const constructorName = this.constructor.name
    this.name = constructorName
    this.message = message
    this.errors = Array.isArray(errors) ? errors : [errors]
    if (statusCode !== null && statusCode !== undefined) { this.statusCode = statusCode }
  }
}
