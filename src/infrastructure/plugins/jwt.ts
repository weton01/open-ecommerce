
import { Encrypter } from '@/use-cases/common/packages'
import { sign } from 'jsonwebtoken'

export class JwtTokenHandler implements Encrypter {
  constructor (
    private readonly secret: string,
    private readonly expirantion: number
  ) {}

  encrypt (value: any): string {
    const expirationInSeconds = this.expirantion
    return sign(value, this.secret, { expiresIn: expirationInSeconds })
  }
}
