# rxdbi: 
An RxJs Database Interface using TypeScript annotations
Heavily inspired from [JDBI](http://jdbi.org/)

## Currenly at the stage of a prototype - comments welcome!

# Example

Write SQL directly - no ORM here!

```TypeScript
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
```