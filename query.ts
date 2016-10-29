import { Observable } from '@reactivex/rxjs';
const functionArgs = require('function-arguments');

/**
 * A database adapter is used to abstract away from the database implementation
 */
export class DatabaseAdapter {
    query<T>(query: string, params?: any): Observable<T> {
        throw 'NotImplemented';
    }
    update(query: string, params?: any): Observable<SqlUpdateResult> {
        throw 'NotImplemented';
    }
}

/**
 * An SQL proxy is required to provide the database property
 */
export interface SqlProxy {
    database: DatabaseAdapter;
}

/**
 * Any option in the future (such as transactions...)
 */
export interface QueryOptions {
}

/**
 * Any non-SELECT (UPDATE, INSERT and DELETE and DDL statements)
 * do not return data but will return this type of data
 */
export interface SqlUpdateResult {
    rowcount?: number
    id?: any
}

/**
 * Annotation for an SQL SELECT query
 */
export function SqlQuery(query: string, options?: QueryOptions) {
    return function (target: SqlProxy, key: string, descriptor: any) {
        const originalMethod = descriptor.value;
        const paramNames: string[] = functionArgs(originalMethod);

        descriptor.value = function <T>(...args: any[]): Observable<T> {
            const me: SqlProxy = this; // type checks
            const queryParams = {};
            for (let i = 0; i < paramNames.length; i++) {
                queryParams[`$${paramNames[i]}`] = args[i];
            }
            return me.database.query(query, queryParams);
        }
        return descriptor;
    }
}

/**
 * Annotation for an SQL non-SELECT statement (UPDATE, INSERT and DELETE and DDL statements)
 */
export function SqlUpdate(query: string, options?: QueryOptions) {
    return function (target: SqlProxy, key: string, descriptor: any) {
        const originalMethod = descriptor.value;
        const paramNames: string[] = functionArgs(originalMethod);

        descriptor.value = function (...args: any[]): Observable<SqlUpdateResult> {
            const me: SqlProxy = this; // type checks
            const queryParams = {};
            for (let i = 0; i < paramNames.length; i++) {
                queryParams[`$${paramNames[i]}`] = args[i];
            }
            return me.database.update(query, queryParams);
        }
        return descriptor;
    }
}
