import { MysqlDialect as KyselyMysqlDialect } from 'kysely';
import type { CreateKyselyDialectOptions } from '../../dialect';
import { IntrospectorDialect } from '../../dialect';
import { MysqlIntrospector } from './mysql-introspector';

export class MysqlIntrospectorDialect extends IntrospectorDialect {
  override readonly introspector = new MysqlIntrospector();

  async createKyselyDialect(options: CreateKyselyDialectOptions) {
    const { createPool } = await import('mysql2');

    return new KyselyMysqlDialect({
      pool: createPool({
        uri: options.connectionString,
        typeCast(field, next) {
          if (field.type === 'TINY' && field.length === 1) {
            return field.string() === '1';
          }
          return next();
        },
      }),
    });
  }
}
