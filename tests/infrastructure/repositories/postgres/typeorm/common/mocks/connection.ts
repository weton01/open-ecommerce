import { PgConnection } from '@/infrastructure/repositories/postgres/typeorm/common/connection'

import { IMemoryDb, newDb } from 'pg-mem'

export const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb()

  db.public.registerFunction({
    implementation: () => 'b5fb62ad-e2b0-4ce9-b7c0-2aa3ea050562',
    name: 'uuid_generate_v4'
  })

  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/repos/postgres/entities/index.ts']
  })

  await connection.synchronize()
  await PgConnection.getInstance().connect()
  return db
}
