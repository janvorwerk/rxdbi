import { Observable, Observer } from '@reactivex/rxjs';
import { Database } from 'sqlite3';
import { DatabaseAdapter, SqlUpdateResult } from './query';

/**
 * The SQlite adapter (using the sqlite3 NPM package)
 */
export class Sqlite3QueryAdapter implements DatabaseAdapter {
    constructor(private db: Database) { }

    query<T>(query: string, params: any = {}): Observable<T> {
        return Observable.create((subscriber: Observer<T>) => {
            this.db.each(query, params,
                (error, content) => {
                    if (subscriber.closed) return;
                    if (error)
                        subscriber.error(error)
                    else
                        subscriber.next(content);
                },
                () => subscriber.complete());
        });
    }
    update(query: string, params: any = {}): Observable<SqlUpdateResult> {
        return Observable.create((subscriber: Observer<SqlUpdateResult>) => {
            this.db.run(query, params, function (error) {
                if (subscriber.closed) return;
                if (error)
                    subscriber.error(error)
                else {
                    subscriber.next({id: this.lastID, rowcount: this.changes});
                    subscriber.complete();
                }
            });
        });
    }
}
