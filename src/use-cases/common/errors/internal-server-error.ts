export class InternalServerError extends Error {
  code: number = 500

  constructor () {
    super()
    this.name = 'InternalServerError'
    this.message = 'Internal Server Error'
  }
}
