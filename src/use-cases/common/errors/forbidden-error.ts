export class ForbiddenError extends Error {
  code: number = 403

  constructor (message: string) {
    super()
    this.name = 'ForbiddenError'
    this.message = message
  }
}
