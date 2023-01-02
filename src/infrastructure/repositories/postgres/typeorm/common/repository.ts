import { PgConnection } from './connection'

import { ObjectLiteral, ObjectType, Repository } from 'typeorm'

export abstract class PgRepository {
  constructor (private readonly connection: PgConnection = PgConnection.getInstance()) {}

  getRepository<T extends ObjectLiteral> (entity: ObjectType<T>): Repository<T> {
    return this.connection.getRepository(entity)
  }
}
