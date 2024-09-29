import { PGlite } from "@electric-sql/pglite";
import Pool from "pg-pool";
import { EventEmitter } from "events";
import types from "pg-types"
import { destr, safeDestr } from "destr";

const db = new PGlite('database', {
});


const parsers = {
    [types.builtins.JSON]: (val) => {
        return destr(destr(val))
    },
    [types.builtins.JSONB]: (val) => {
        return destr(destr(val))
    }
}
class Client extends EventEmitter {
    constructor() {
        super();
    }

    async connect(cb: (err, client: Client) => void) {
        await db.waitReady
        cb(null, this);
    }
    query(query: string | { text: string, values: any }, values: any[], cb: (err, res) => void) {

        if (typeof query === 'object') {
            if (query.values) {
                values = query.values
            }
            query = query.text
        }
        const call = values ? () => db.query(query, values, {
            parsers,
        }) : () => db.exec(query, {
            parsers
        })
        if (typeof cb === 'function') {
            call().then((r) => {
                cb(null, r);
            }).catch((e) => {
                cb(e, null);
            });
            return
        }
        return call().then((r) => {

            if (Array.isArray(r)) {
                return r[0]
            }
            if (r?.rows?.length) {
                console.log(r);
            }
            return r
        })
    }

    ref() {
        // console.log('ref');
    }
    unref() {
        // console.log('unref');
    }
    end() {
        // console.log('end');
    }
    release() {
        // console.log('release');
    }
}

export const pool = new Pool({
    Client: Client,
});
