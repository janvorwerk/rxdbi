import { Observable } from '@reactivex/rxjs';
import { Database } from 'sqlite3';

import { SqlQuery, SqlProxy, DatabaseAdapter, SqlUpdate, SqlUpdateResult } from './query';
import { Sqlite3QueryAdapter } from './query-sqlite';

const dbAdapter = new Sqlite3QueryAdapter(new Database(':memory:'));

interface LoremRecord {
  id: number;
  info: string;
}

class LoremDao implements SqlProxy {
  constructor(public database: DatabaseAdapter) { }

  @SqlUpdate(`
    CREATE TABLE lorem (id NUMBER, info TEXT)
  `)
  createTable(): Observable<SqlUpdateResult> { throw '' }

  @SqlUpdate(`
    INSERT INTO lorem (id, info)
    VALUES ($id, $info)
  `)
  insert(id: number, info: string): Observable<SqlUpdateResult> { throw '' }

  @SqlQuery(`
    SELECT id, info
    FROM lorem
    WHERE id = $id
  `)
  getById(id: number): Observable<LoremRecord> { throw '' }

  @SqlQuery(`
    SELECT id, info
    FROM lorem
  `)
  getAll(): Observable<LoremRecord> { throw '' }
}

const dao = new LoremDao(dbAdapter);

dao.createTable().subscribe({
  complete: () => {
    Observable
      .range(1, 10)
      .flatMap((i: number) => dao.insert(i, `lorem ${i}`))
      .subscribe(
      (r: SqlUpdateResult) => console.log(`created entry ${JSON.stringify(r)}`),
      err => console.error(err),
      () => {
        console.log('Now querying...')
        dao.getAll().subscribe(val => console.log(val),
          err => console.error(err),
          () => {
            console.log('Got them all... now cheching #5');
            dao.getById(5)
              .subscribe(val => console.log(val));
          });
      });
  }
});
