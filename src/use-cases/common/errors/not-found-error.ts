export class NotFoundError extends Error {
  code: number = 404

  constructor (message: string) {
    super()
    this.name = 'NotFoundError'
    this.message = message
  }
}
