export class BadRequestError extends Error {
  code: number = 400

  constructor (message: string) {
    super()
    this.name = 'BadRequestError'
    this.message = message
  }
}
