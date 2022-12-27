import { UniqueIdGenerator } from '@/use-cases/common/packages/unique-id-generator'

import { v4 } from 'uuid'

export class UUIDHandler implements UniqueIdGenerator {
  generate (): string {
    return v4()
  }
}
