import { run } from "graphile-worker";
import { pool } from "./pool"

async function main() {
    // Run a worker to execute jobs:
    const runner = await run({
        pgPool: pool,
        concurrency: 10,
        // Install signal handlers for graceful shutdown on SIGINT, SIGTERM, etc
        noHandleSignals: false,
        pollInterval: 1000,
        // you can set the taskList or taskDirectory but not both
        taskList: {
            hello: async (payload: any, helpers) => {
                console.log(new Date().toISOString());
                console.log(typeof payload, payload);

                // await wait(3000);
                helpers.logger.info(`Hello, ${payload.name} :: ${new Date().toISOString()}`);
            },
        },
        // or:
        //   taskDirectory: `${__dirname}/tasks`,
    });


    // Immediately await (or otherwise handle) the resulting promise, to avoid
    // "unhandled rejection" errors causing a process crash in the event of
    // something going wrong.
    await runner.promise;

    // If the worker exits (whether through fatal error or otherwise), the above
    // promise will resolve/reject.
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});