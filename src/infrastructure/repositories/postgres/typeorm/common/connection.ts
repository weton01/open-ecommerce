import { ConnectionNotFoundError } from '@/infrastructure/repositories/postgres/typeorm/errors'

import { createConnection, getConnection, getConnectionManager, ObjectType, QueryRunner, Repository, Connection, getRepository, ObjectLiteral } from 'typeorm'

export class PgConnection {
  private static instance?: PgConnection
  private readonly query?: QueryRunner
  private connection?: Connection

  private constructor () {}

  static getInstance (): PgConnection {
    if (PgConnection.instance === undefined) PgConnection.instance = new PgConnection()
    return PgConnection.instance
  }

  async connect (): Promise<void> {
    this.connection = getConnectionManager().has('default')
      ? getConnection()
      : await createConnection()
  }

  async disconnect (): Promise<void> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()
    await getConnection().close()
    this.connection = undefined
  }

  getRepository<T extends ObjectLiteral> (entity: ObjectType<T>): Repository<T> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()
    return getRepository(entity)
  }
}
