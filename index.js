'use strict';

import { MultiWorker } from 'node-resque';
import config from 'config';
import logger from 'screwdriver-logger';
import jobs from './lib/jobs';
import * as server from './lib/server';
import { connectionDetails, queuePrefix } from './config/redis';

import { workerConfig, httpdConfig } from './types/config';

const workerConfig: workerConfig = config.get('unzip-service');
const httpdConfig: httpdConfig = config.get('httpd');

const multiWorker = new MultiWorker(
    {
        connection: connectionDetails,
        queues: [`${queuePrefix}unzip`],
        minTaskProcessors: workerConfig.minTaskProcessors,
        maxTaskProcessors: workerConfig.maxTaskProcessors,
        checkTimeout: workerConfig.checkTimeout,
        maxEventLoopDelay: workerConfig.maxEventLoopDelay
    },
    jobs
);

const boot = async () => {
    // Start http server for health check
    await server.start(httpdConfig);

    // normal worker emitters
    multiWorker.on('start', workerId => {
        logger.info(`worker[${workerId}] started`);
    });
    multiWorker.on('end', workerId => {
        logger.info(`worker[${workerId}] ended`);
    });
    multiWorker.on('cleaning_worker', (workerId, worker) => {
        logger.info(`cleaning old worker[${workerId}] ${worker}`);
    });
    multiWorker.on('poll', (workerId, queue) => {
        logger.info(`worker[${workerId}] polling ${queue}`);
    });
    multiWorker.on('ping', (workerId, time) => {
        logger.info(`worker[${workerId}] check in @ ${time}`);
    });
    multiWorker.on('job', (workerId, queue, job) => {
        logger.info(`worker[${workerId}] working job ${queue} ${JSON.stringify(job)}`);
    });
    multiWorker.on('reEnqueue', (workerId, queue, job, plugin) => {
        logger.info(`worker[${workerId}] reEnqueue job (${JSON.stringify(plugin)}) ${queue} ${JSON.stringify(job)}`);
    });
    multiWorker.on('success', (workerId, queue, job, result) => {
        logger.info(`worker[${workerId}] job success ${queue} ${JSON.stringify(job)} >> ${result}`);
    });
    multiWorker.on('failure', (workerId, queue, job, failure) => {
        logger.info(`worker[${workerId}] job failure ${queue} ${JSON.stringify(job)} >> ${failure}`);
    });
    multiWorker.on('error', (workerId, queue, job, error) => {
        logger.info(`worker[${workerId}] error ${queue} ${JSON.stringify(job)} >> ${error}`);
    });
    multiWorker.on('pause', workerId => {
        logger.info(`worker[${workerId}] paused`);
    });

    // multiWorker emitters
    multiWorker.on('multiWorkerAction', (verb, delay) => {
        // Save the last emitted time of this event for health check.
        server.saveLastEmittedTime();
        logger.info(`*** checked for worker status: ${verb} (event loop delay: ${delay}ms)`);
    });

    multiWorker.start();
};

boot();

process.on('unhandledRejection', err => {
    logger.error('Unhandled error', err);
    process.exit(1);
});
