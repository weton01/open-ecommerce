import { Comparator, Hasher } from '@/use-cases/common/packages'
import bcrypt from 'bcryptjs'

export class BcryptAdapter implements Hasher, Comparator {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    return bcrypt.hash(value, this.salt)
  }

  async compare (value: string, digest: string): Promise<boolean> {
    return bcrypt.compare(value, digest)
  }
}
