export class ConflictError extends Error {
  code: number = 409

  constructor (message: string) {
    super()
    this.name = 'ConflictError'
    this.message = message
  }
}
